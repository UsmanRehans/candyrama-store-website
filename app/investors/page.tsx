import { InfoPage, InfoSection } from '@/components/info-page';

export const metadata = {
  title: 'Investor Relations | CandyRama',
  description: 'Learn about the CandyRama business and investor conversations.',
};

export default function InvestorsPage() {
  return <InfoPage eyebrow="INVESTOR RELATIONS" title="Help us build the next candy obsession" intro="CandyRama is creating a joyful modern candy brand from Houston, with bold products and an appetite for growth.">
    <InfoSection title="What we are building"><p>We are bringing a distinct voice, memorable design, and an expanding candy catalog into one shopping experience. Our goal is simple: make CandyRama the brand people remember before they even finish the bag.</p></InfoSection>
    <InfoSection title="Where we are focused"><p>Our work centers on product expansion, reliable operations, retail relationships, direct customer growth, and experiences that give people a reason to return.</p></InfoSection>
    <InfoSection title="Start a conversation"><p>Qualified investors and strategic partners can contact <a href="mailto:usman@twistedtreatz.com">usman@twistedtreatz.com</a> to request current information and discuss opportunities.</p><p>This page is for general information only. It is not an offer to sell or a request to buy any security.</p></InfoSection>
  </InfoPage>;
}
