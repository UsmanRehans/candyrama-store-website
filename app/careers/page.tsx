import { InfoPage, InfoSection } from '@/components/info-page';

export const metadata = {
  title: 'Careers | CandyRama',
  description: 'Explore opportunities to join the CandyRama team.',
};

export default function CareersPage() {
  return <InfoPage eyebrow="COME MAKE SOME MAGIC" title="Bring your flavor to CandyRama" intro="We are building a candy brand with big ideas, bright energy, and room for people who care about the details.">
    <InfoSection title="Life on the team"><p>We move fast, stay curious, and help each other get the good ideas out into the world. Our work touches candy, packaging, content, operations, customer care, and everything between the first taste and the final delivery.</p></InfoSection>
    <InfoSection title="Who fits here"><p>You might belong at CandyRama if you take ownership, communicate clearly, notice what others miss, and believe work can be thoughtful without becoming stiff.</p><p>Bring your skills. Bring your point of view. Bring snack recommendations.</p></InfoSection>
    <InfoSection title="Open roles"><p>We do not have any CandyRama roles posted right now. New opportunities will appear here when they are ready.</p><p>Think you could bring something special to the team? Send a short introduction and your work to <a href="mailto:customercare@twistedtreatz.com">customercare@twistedtreatz.com</a>.</p></InfoSection>
  </InfoPage>;
}
