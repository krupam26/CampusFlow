import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      organizationId: true,
    },
  });

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireUser();

  if (!roles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export async function requireOrganization(
  organizationId: string,
) {
  const user = await requireUser();

  if (
    user.role !== Role.ADMIN &&
    user.organizationId !== organizationId
  ) {
    throw new Error("FORBIDDEN");
  }

  return user;
}
