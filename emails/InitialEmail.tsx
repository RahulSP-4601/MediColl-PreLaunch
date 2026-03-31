import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Button,
  Hr,
} from '@react-email/components';

interface InitialEmailProps {
  name?: string;
  clinicName?: string;
  city?: string;
}

export const InitialEmail = ({
  name,
  clinicName,
  city,
}: InitialEmailProps) => {
  const greeting = name ? `Hi ${name}` : 'Hi';
  const clinicMention = clinicName
    ? `I noticed ${clinicName}${city ? ` in ${city}` : ''}.`
    : '';

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerText}>
              🎯 Never miss a patient call again
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={paragraph}>{greeting},</Text>

            {clinicMention && (
              <Text style={paragraph}>{clinicMention}</Text>
            )}

            <Text style={paragraph}>
              My name is <strong>Rahul Sanjay Panchal</strong>, CEO of{' '}
              <strong>MediColl24</strong>.
            </Text>

            <Text style={paragraph}>
              Many clinics lose patients due to <strong>missed calls</strong>{' '}
              and <strong>after-hours unavailability</strong>. We're solving
              this.
            </Text>

            {/* Features Box */}
            <Section style={featuresBox}>
              <Text style={featuresTitle}>
                MediColl24 is a 24/7 AI voice receptionist that:
              </Text>
              <Text style={feature}>✅ Answers every call (24/7)</Text>
              <Text style={feature}>✅ Books appointments automatically</Text>
              <Text style={feature}>✅ Handles doctor unavailability</Text>
              <Text style={feature}>✅ Prevents double bookings</Text>
            </Section>

            <Text style={paragraph}>
              We're launching in <strong>mid-May</strong> and offering{' '}
              <strong>limited early access</strong>.
            </Text>

            <Text style={paragraph}>
              Would you be interested in joining the waitlist?
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button
                style={button}
                href={process.env.NEXT_PUBLIC_WAITLIST_URL}
              >
                Join Waitlist
              </Button>
            </Section>

            <Text style={paragraph}>
              Happy to answer any questions!
            </Text>

            {/* Signature */}
            <Text style={signature}>
              Best regards,
              <br />
              <strong>Rahul Sanjay Panchal</strong>
              <br />
              CEO - MediColl24
              <br />
              <Link href="mailto:rahul@medicoll.com" style={link}>
                rahul@medicoll.com
              </Link>
              {' | '}
              <Link href="https://www.medicoll24.com" style={link}>
                medicoll24.com
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              <Link
                href={process.env.NEXT_PUBLIC_UNSUBSCRIBE_URL}
                style={footerLink}
              >
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '30px 40px',
  borderRadius: '8px 8px 0 0',
};

const headerText = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0',
};

const content = {
  padding: '40px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333333',
  marginBottom: '16px',
};

const featuresBox = {
  backgroundColor: '#f8f9ff',
  border: '2px solid #667eea',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const featuresTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333333',
  marginBottom: '12px',
};

const feature = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#555555',
  margin: '8px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
};

const signature = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#555555',
  marginTop: '32px',
};

const link = {
  color: '#667eea',
  textDecoration: 'none',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  padding: '0 40px',
};

const footerText = {
  fontSize: '12px',
  lineHeight: '16px',
  color: '#8898aa',
  textAlign: 'center' as const,
};

const footerLink = {
  color: '#8898aa',
  textDecoration: 'underline',
};

export default InitialEmail;
