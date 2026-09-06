import { InfoPage, InfoSection } from '@/components/info-page';

export const metadata = {
  title: 'Investor Relations | CandyRama',
  description: 'Learn about the CandyRama business and investor conversations.',
};

export default function InvestorsPage() {
  return <InfoPage eyebrow="INVESTOR RELATIONS" title="Help us grow the candy aisle" intro="CandyRama is a Rosenberg candy brand built for online orders and store shelves.">
    <InfoSection title="What we sell"><p>CandyRama sells gummies, sour candy, spicy candy, bark, and brittle in bright packaging people remember.</p></InfoSection>
    <InfoSection title="What comes next"><p>We are adding products, improving how we pack and ship orders, and working with more retailers.</p></InfoSection>
    <InfoSection title="Start a conversation"><p>Qualified investors and business partners can contact <a href="mailto:admin@thecandyrama.com">admin@thecandyrama.com</a> to request current information and discuss opportunities.</p><p>This page is for general information only. It is not an offer to sell or a request to buy any security.</p></InfoSection>
  </InfoPage>;
}
