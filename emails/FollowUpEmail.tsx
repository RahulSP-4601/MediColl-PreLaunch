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

interface FollowUpEmailProps {
  name?: string;
  clinicName?: string;
}

export const FollowUpEmail = ({ name, clinicName }: FollowUpEmailProps) => {
  const greeting = name ? `Hi ${name}` : 'Hi';

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerText}>
              Just checking — worth exploring?
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={paragraph}>{greeting},</Text>

            <Text style={paragraph}>
              I sent you a message about <strong>MediColl24</strong> — our 24/7 AI
              voice receptionist for clinics.
            </Text>

            <Text style={paragraph}>
              <strong>Quick question:</strong> Did you get a chance to check it
              out?
            </Text>

            {/* Feedback Box */}
            <Section style={feedbackBox}>
              <Text style={feedbackTitle}>I'd love to hear your thoughts:</Text>
              <Text style={feedbackItem}>
                • Is this something you'd find useful?
              </Text>
              <Text style={feedbackItem}>
                • Any questions I can answer?
              </Text>
            </Section>

            <Text style={paragraph}>
              We're launching in <strong>mid-May</strong> with{' '}
              <strong>limited early access spots</strong>.
            </Text>

            <Text style={paragraph}>
              If you're interested, there's still time to join the waitlist:
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

            <Text style={paragraph}>Thanks for your time!</Text>

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
  fontSize: '26px',
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

const feedbackBox = {
  backgroundColor: '#f8f9ff',
  border: '2px solid #667eea',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const feedbackTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333333',
  marginBottom: '12px',
};

const feedbackItem = {
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

export default FollowUpEmail;
