import { InfoPage, InfoSection } from '@/components/info-page';

export const metadata = {
  title: 'Freshness Promise | CandyRama',
  description: 'How CandyRama checks, packs, seals, and ships every order with care.',
};

export default function FreshnessPromisePage() {
  return <InfoPage eyebrow="OUR PROMISE TO YOU" title="Fresh candy. Full drama." intro="Every bag is checked, packed, and delivered with care. That is how the good stuff stays good.">
    <InfoSection title="Packed for your order"><p>Your candy is packed for your order and sealed before it leaves our Houston home base. We do not want tired treats sitting around waiting for their big moment.</p></InfoSection>
    <InfoSection title="Checked before it ships"><p>We look at texture, color, packaging, and seal quality before an item goes into your box. If something does not look right, it does not make the trip.</p></InfoSection>
    <InfoSection title="Heat gets special attention"><p>Chocolate, brittle, caramel, and some gummies can be sensitive to warm weather. We pack with care and may recommend faster shipping when temperatures climb. Bring deliveries inside as soon as possible so the Texas sun does not join the tasting party.</p></InfoSection>
    <InfoSection title="Plenty of time to enjoy"><p>We check date information before products ship and do not send items that are too close to their stated quality date. Store your treats sealed in a cool, dry place for their best flavor and texture.</p></InfoSection>
    <InfoSection title="Something not right"><p>Tell us within 48 hours if your order arrives damaged, incomplete, or incorrect. Include your order number and a clear photo when possible. We will review it and help make things right.</p></InfoSection>
  </InfoPage>;
}
