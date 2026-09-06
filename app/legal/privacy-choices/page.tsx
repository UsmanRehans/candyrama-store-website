import Link from 'next/link';
import { InfoPage, InfoSection } from '@/components/info-page';

export const metadata = {
  title: 'Your Privacy Choices | CandyRama',
  description: 'Learn how to make a privacy request or manage your CandyRama communication choices.',
};

export default function PrivacyChoicesPage() {
  return <InfoPage eyebrow="YOUR INFORMATION" title="Your privacy choices" intro="You should have a clear way to ask questions and make choices about your personal information.">
    <InfoSection title="Make a request"><p>Depending on where you live, you may ask to access, correct, delete, or receive a copy of certain personal information. You may also ask us to limit some uses of your information.</p><p>Email <a href="mailto:admin@thecandyrama.com">admin@thecandyrama.com</a> with the subject Privacy Request. Tell us what you would like us to review.</p></InfoSection>
    <InfoSection title="Confirming your identity"><p>We may need to confirm your identity before completing a request. This protects your information from being accessed or changed by someone else.</p></InfoSection>
    <InfoSection title="Marketing choices"><p>You can unsubscribe from marketing email using the link in any promotional message. Service messages about orders, payments, shipping, or account security may still be sent when needed.</p></InfoSection>
    <InfoSection title="Authorized requests"><p>An authorized representative may submit a request where permitted by law. We may ask for proof of authorization and may still need to confirm the customer identity directly.</p></InfoSection>
    <InfoSection title="More details"><p>Read our <Link href="/legal/privacy">privacy policy</Link> for more information about what we collect, why we use it, and when it is shared.</p></InfoSection>
  </InfoPage>;
}
