import Link from 'next/link';
import { InfoPage, InfoSection } from '@/components/info-page';

export const metadata = {
  title: 'Why CandyRama',
  description: 'Big flavor, joyful candy, and careful packing from CandyRama in Houston, Texas.',
};

export default function WhyCandyRamaPage() {
  return <InfoPage eyebrow="WHY CANDYRAMA" title="Candy should be the fun part" intro="Big flavor, bright energy, and treats that know how to make an entrance.">
    <InfoSection title="Flavor comes first"><p>We choose candy that earns its spot in the bag. That means bold fruit, serious sour, satisfying crunch, and chewy bites worth coming back for.</p><p>No sleepy candy. No forgettable handfuls. Just the good stuff.</p></InfoSection>
    <InfoSection title="Packed with care"><p>Every order is checked, packed, and sealed by people who care about what reaches your door. We pay attention to freshness, presentation, and the tiny details that turn a delivery into a moment.</p></InfoSection>
    <InfoSection title="Made for real life"><p>CandyRama belongs at movie nights, birthdays, road trips, desk drawers, gift tables, and quiet Tuesdays that need better energy. Share it with everyone, or protect your stash. We understand both choices.</p></InfoSection>
    <InfoSection title="Ready for a taste"><p>Meet the sweet, sour, spicy, chewy, and crunchy sides of CandyRama.</p><Link href="/shop" className="button primary">Shop the candy</Link></InfoSection>
  </InfoPage>;
}
