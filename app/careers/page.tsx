import { InfoPage, InfoSection } from '@/components/info-page';

export const metadata = {
  title: 'Careers | CandyRama',
  description: 'Explore opportunities to join the CandyRama team.',
};

export default function CareersPage() {
  return <InfoPage eyebrow="COME MAKE SOME MAGIC" title="Bring your flavor to CandyRama" intro="We are a small Houston candy team with plenty to build.">
    <InfoSection title="Life on the team"><p>Some days are about candy. Others are about boxes, photos, spreadsheets, or helping a customer find a missing order. Everyone pitches in and good ideas can come from anybody.</p></InfoSection>
    <InfoSection title="Who fits here"><p>You take care of your work, speak up when something feels off, and help the person next to you. You also have strong opinions about snacks. That helps.</p></InfoSection>
    <InfoSection title="Open roles"><p>We do not have any CandyRama roles posted right now. New opportunities will appear here when they are ready.</p><p>Think you could bring something special to the team? Send a short introduction and your work to <a href="mailto:customercare@twistedtreatz.com">customercare@twistedtreatz.com</a>.</p></InfoSection>
  </InfoPage>;
}
