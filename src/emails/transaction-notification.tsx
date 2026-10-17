import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  name: string;
  description: string;
  amount: string;
  reference: string;
};

export default function TransactionNotification({
  name,
  description,
  amount,
  reference,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your CampusFlow transaction was recorded.</Preview>

      <Body
        style={{
          backgroundColor: "#f4f0e6",
          fontFamily: "Arial, sans-serif",
          padding: "24px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#fffdf6",
            border: "1px solid #c9c3b3",
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "520px",
          }}
        >
          <Heading style={{ color: "#17232b" }}>
            CampusFlow
          </Heading>

          <Text>Hello {name},</Text>

          <Text>
            Your transaction has been successfully recorded.
          </Text>

          <Section
            style={{
              backgroundColor: "#dceff0",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <Text>
              <strong>Description:</strong> {description}
            </Text>
            <Text>
              <strong>Amount:</strong> {amount}
            </Text>
            <Text>
              <strong>Reference:</strong> {reference}
            </Text>
          </Section>

          <Text style={{ color: "#657078", fontSize: "12px" }}>
            This is an automated notification from CampusFlow.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
