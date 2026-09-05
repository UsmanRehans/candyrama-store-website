import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, Sparkles, Sun } from 'lucide-react';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';

export const metadata = { title: 'Our Story | CandyRama', description: 'Meet CandyRama: a tiny Texas candy workshop making bold, joyful treats in small batches.' };

export default function AboutPage() {
  return <main><StoreHeader />
    <section className="about-hero"><Image src="/generated/workshop.png" alt="Two CandyRama makers crafting gummies by hand" fill priority sizes="100vw" /><div className="about-hero-copy"><p className="eyebrow">OUR STORY</p><h1>A tiny Texas workshop with a whole lot of flavor.</h1></div></section>
    <section className="story-intro"><div><p className="eyebrow">HOW IT STARTED</p><h2>We wanted candy to feel fun again.</h2></div><div><p>Not just sweet. Not just another bag on the shelf. We wanted the kind of candy that starts conversations, gets passed around the table, and makes people say, “Wait—what flavor is that?”</p><p>So we built CandyRama: a small-batch candy company in Texas with an appetite for bold flavors and a soft spot for the classics.</p></div></section>
    <section className="values-strip"><article><Sparkles /><h3>Big flavor</h3><p>Sour that puckers. Chamoy with a real kick. Chocolate with serious crunch.</p></article><article><Heart /><h3>Made with care</h3><p>Small batches, premium ingredients and hands-on attention at every step.</p></article><article><Sun /><h3>Texas energy</h3><p>Warm, welcoming and never afraid to turn the volume all the way up.</p></article></section>
    <section className="about-lifestyle"><div className="about-lifestyle-image"><Image src="/generated/candy-picnic.png" alt="Friends enjoying colorful candy together outdoors" fill sizes="(max-width: 800px) 100vw, 58vw" /></div><div className="about-lifestyle-copy"><span className="story-number">01</span><p className="eyebrow">CANDY IS A SOCIAL FOOD</p><h2>Made for passing around.</h2><p>The best candy never stays in one person’s hands for long. It belongs at movie nights, road trips, backyard hangs and the desk drawer everybody knows about.</p><Link href="/shop" className="button secondary">Taste the lineup <ArrowRight /></Link></div></section>
    <section className="about-manifesto"><p>NO BIG FACTORY LINE.</p><p>NO WEIRD CORPORATE ANYTHING.</p><h2>Just really good candy<br/>from your neighbors.</h2><Link href="/shop" className="button primary">Shop CandyRama</Link></section>
    <StoreFooter />
  </main>;
}
