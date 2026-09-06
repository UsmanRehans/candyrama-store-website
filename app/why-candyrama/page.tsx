import Link from 'next/link';
import { InfoPage, InfoSection } from '@/components/info-page';

export const metadata = {
  title: 'Why CandyRama',
  description: 'Big flavor, joyful candy, and careful packing from CandyRama in Houston, Texas.',
};

export default function WhyCandyRamaPage() {
  return <InfoPage eyebrow="WHY CANDYRAMA" title="Candy should be the fun part" intro="Expect loud flavor and a bag that disappears fast.">
    <InfoSection title="Flavor comes first"><p>We want fruit you can taste, sour with a real pucker, chocolate that snaps, and gummies with a proper chew.</p><p>No sleepy candy. No forgettable handfuls. Just the good stuff.</p></InfoSection>
    <InfoSection title="Packed with care"><p>We check the candy, seal the bag, and pack the box at our Houston home base. Your order should look good when you open it and taste even better.</p></InfoSection>
    <InfoSection title="Made for real life"><p>CandyRama belongs at movie nights, birthdays, road trips, desk drawers, gift tables, and quiet Tuesdays that need better energy. Share it with everyone, or protect your stash. We understand both choices.</p></InfoSection>
    <InfoSection title="Ready for a taste"><p>Meet the sweet, sour, spicy, chewy, and crunchy sides of CandyRama.</p><Link href="/shop" className="button primary">Shop the candy</Link></InfoSection>
  </InfoPage>;
}
