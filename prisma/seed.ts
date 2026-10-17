import "dotenv/config";
import { faker } from "@faker-js/faker";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import {
  PrismaClient,
  Role,
  TransactionStatus,
  type User,
} from "@prisma/client";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function withRetry<T>(fn: () => Promise<T>, retries = 5, delayMs = 1000): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`[Attempt ${attempt}/${retries}] Retrying database operation...`);
      await new Promise((r) => setTimeout(r, delayMs * attempt));
    }
  }
  throw new Error("Failed after retries");
}

async function main() {
  faker.seed(42);

  console.log("Starting CampusFlow database seeding...");

  const organization = await withRetry(() =>
    prisma.organization.upsert({
      where: { slug: "djsce-demo" },
      update: {},
      create: {
        name: "DJSCE Demo Organization",
        slug: "djsce-demo",
      },
    })
  );

  const users: User[] = [];

  for (let i = 0; i < 15; i++) {
    const role =
      i === 0
        ? Role.ADMIN
        : i < 10
          ? Role.MEMBER
          : Role.GUEST;

    const email =
      i === 0
        ? "admin@campusflow.demo"
        : `student${i}@campusflow.demo`;

    const user = await withRetry(() =>
      prisma.user.upsert({
        where: { email },
        update: {
          organizationId: organization.id,
          role,
        },
        create: {
          id: faker.string.uuid(),
          name:
            i === 0
              ? "CampusFlow Admin"
              : faker.person.fullName(),
          email,
          emailVerified: true,
          role,
          organizationId: organization.id,
        },
      })
    );

    users.push(user);
  }

  console.log(`Users created or reused: ${users.length}`);

  for (let i = 0; i < 30; i++) {
    const user = users[i % users.length];

    await withRetry(() =>
      prisma.transaction.upsert({
        where: { reference: `CF-DEMO-${i + 1}` },
        update: {},
        create: {
          reference: `CF-DEMO-${i + 1}`,
          description: faker.helpers.arrayElement([
            "Course registration",
            "Workshop enrollment",
            "Laboratory fee",
            "Event registration",
          ]),
          amount: faker.number
            .int({ min: 100, max: 5000 }),
          currency: "INR",
          status: faker.helpers.arrayElement(
            Object.values(TransactionStatus),
          ),
          userId: user.id,
          organizationId: organization.id,
        },
      })
    );
  }

  await withRetry(() =>
    prisma.auditLog.create({
      data: {
        action: "DATABASE_SEEDED",
        entity: "Organization",
        entityId: organization.id,
        details: {
          source: "prisma/seed.ts",
          userCount: users.length,
          transactionCount: 30,
        },
        organizationId: organization.id,
        actorId: users[0].id,
      },
    })
  );

  console.log("Organization: djsce-demo");
  console.log("Transactions: 30");
  console.log("Audit log recorded.");
  console.log("Seeding completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
