'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './studio.module.css';

const media = '/amazon-demo/media/';
const reviewStatus = 'Production review · label/SKU verification pending';
const artwork = [
  { name: 'store-pouches-v5.jpg', width: 3000, height: 600, title: 'Brand Store header', module: 'Store header hero', alt: 'Two pink Candy Rama pouches in a peach studio setting, showing separate candy varieties' },
  { name: 'aplus-gummy-hero-v5.jpg', width: 970, height: 600, title: 'Gummy pouch hero', module: 'Standard Image Header with Text', alt: 'Single pink Candy Rama gummy pouch in a peach studio setting' },
  { name: 'aplus-gummy-detail-v5.jpg', width: 970, height: 300, title: 'A closer look', module: 'Standard Image & Text Overlay', alt: 'Detail of the Candy Rama gummy pouch and its clear candy window' },
  { name: 'aplus-gummy-pouch-v5.jpg', width: 300, height: 300, title: 'Full pouch', module: 'Standard Single Side Image', alt: 'Full upright pink Candy Rama gummy pouch with its clear window' },
] as const;
type Artwork = (typeof artwork)[number];
type View = 'store' | 'product' | 'artwork';

function Wordmark({ small = false }: { small?: boolean }) {
  return <span className={small ? styles.wordmarkSmall : styles.wordmark}>CANDY<br />RAMA</span>;
}

function ArtImage({ art, priority = false }: { art: Artwork; priority?: boolean }) {
  // Authenticated artwork must not enter the public image optimization cache.
  return <Image src={`${media}${art.name}`} alt={art.alt} width={art.width} height={art.height} unoptimized loading={priority ? 'eager' : 'lazy'} />;
}

export function DemoStudio() {
  const [view, setView] = useState<View>('store');
  const [size, setSize] = useState<'desktop' | 'mobile'>('desktop');

  return <main className={styles.studio}>
    <header className={styles.toolbar}>
      <div className={styles.studioTitle}><Wordmark small /><div><strong>AMAZON CREATIVE PREVIEW</strong><span>Candy Rama · Pouch studio / 05</span></div></div>
      <form action="/amazon-demo/session" method="post"><input name="action" value="logout" type="hidden" /><button className={styles.signout}>Sign out</button></form>
    </header>
    <div className={styles.controls}>
      <nav aria-label="Preview views" className={styles.views}>
        {([['store', 'Brand store'], ['product', 'Gummy A+'], ['artwork', 'Asset downloads']] as const).map(([key, label]) => <button key={key} aria-pressed={view === key} onClick={() => setView(key)}>{label}</button>)}
      </nav>
      <div className={styles.device} aria-label="Preview width"><button aria-pressed={size === 'desktop'} onClick={() => setSize('desktop')}>Desktop</button><button aria-pressed={size === 'mobile'} onClick={() => setSize('mobile')}>Mobile</button></div>
    </div>
    <div className={styles.caption}><span>{view === 'store' ? '01 / AMAZON BRAND STORE' : view === 'product' ? '02 / SINGLE GUMMY POUCH A+ CONCEPT' : '03 / PRODUCTION ASSET GALLERY'}</span><span>{reviewStatus}</span></div>
    <div className={`${styles.canvas} ${size === 'mobile' ? styles.mobile : ''}`}>
      {view === 'store' && <section aria-label="Candy Rama brand Store concept">
        <div className={styles.brandBanner}><Wordmark /><p>TASTE THE TWIST.</p><span>Texas-based.<br />Candy-obsessed.</span></div>
        <div className={styles.storeHeader}><ArtImage art={artwork[0]} priority /></div>
        <div className={styles.storeIntro}><p className={styles.kicker}>CANDY RAMA</p><h1>A HANDFUL OF HAPPY.</h1><p>Find a little color for your next candy break.</p><a className={styles.pill} href="#demo-collection">Explore the collection <span aria-hidden="true">↘</span></a></div>
        <div className={styles.ribbon} aria-hidden="true">COLORFUL BITES <i>✦</i> HAPPY HANDFULS <i>✦</i> LITTLE CANDY MOMENTS</div>
        <div id="demo-collection" className={styles.collection}>
          <div className={styles.sectionHeading}><p className={styles.kicker}>PICK YOUR NEXT SWEET MOMENT</p><h2>What sounds good?</h2></div>
          <article className={styles.productFeature}><ArtImage art={artwork[1]} /><div><p className={styles.kicker}>THE GUMMY DIRECTION</p><h2>COLOR YOUR<br />CANDY BREAK.</h2><p>A little color. A little chew. A moment to enjoy.</p><button className={styles.pill} onClick={() => setView('product')}>View gummy A+ direction ↗</button></div></article>
          <p className={styles.internalNote}>Collection concept: the header shows separate product varieties, not an included two-pouch bundle. Final catalog destinations and SKU details are pending.</p>
        </div>
        <div className={styles.storeFooter}><Wordmark small /><p>FIND YOUR HAPPY HANDFUL.<br /><strong>Candy Rama</strong></p></div>
      </section>}
      {view === 'product' && <section className={styles.aplus} aria-label="Single gummy pouch A plus content concept">
        <div className={styles.aplusTitle}><h1>Product description</h1><span>Single gummy pouch · Three-module concept</span></div>
        <div className={styles.aplusStack}>
          <article className={styles.reviewModule}><ArtImage art={artwork[1]} priority /><div className={styles.nativeCopy}><h2>HAPPINESS, BY THE HANDFUL.</h2><p>Make a little room for candy.</p></div><p className={styles.moduleSpec}>01 · Standard Image Header with Text · 970 × 600 px</p></article>
          <article className={styles.reviewModule}><ArtImage art={artwork[2]} /><div className={styles.nativeCopy}><h2>TAKE A CLOSER LOOK.</h2><p>A little color for your candy break.</p></div><p className={styles.moduleSpec}>02 · Standard Image & Text Overlay · 970 × 300 px · Copy shown separately for mobile readability</p></article>
          <article className={styles.reviewModule}><div className={styles.sideModule}><ArtImage art={artwork[3]} /><div className={styles.nativeCopy}><h2>TASTE THE TWIST.</h2><p>Candy Rama</p></div></div><p className={styles.moduleSpec}>03 · Standard Single Side Image · 300 × 300 px</p></article>
        </div>
        <p className={styles.internalNote}>Editable copy is shown as live text outside the image exports. This is a layout review; final module rendering must be checked in Amazon’s desktop and mobile builder previews.</p>
      </section>}
      {view === 'artwork' && <section className={styles.packaging}>
        <div className={styles.sectionHeading}><p className={styles.kicker}>POUCH STUDIO / 05</p><h1>Made for a closer look.</h1><p>Download the individual image canvases. Review notes and headings are kept outside the artwork.</p></div>
        <div className={styles.artworkGrid}>{artwork.map(art => <figure key={art.name}><ArtImage art={art} /><figcaption><strong>{art.title}</strong><span>{art.module} · {art.width} × {art.height} px · JPG</span><span className={styles.status}>{reviewStatus}</span><a href={`${media}${art.name}?download=1`} download={art.name}>Download image ↓</a><a href={`${media}${art.name}`} target="_blank" rel="noreferrer">Inspect full image ↗</a></figcaption></figure>)}
          <figure><Image src={`${media}packaging-reference.jpeg`} alt="Original owner photograph of two pink Candy Rama pouches" width={3840} height={5120} unoptimized /><figcaption><strong>Original packaging reference</strong><span>Owner-supplied photograph · Reference only</span><a href={`${media}packaging-reference.jpeg`} target="_blank" rel="noreferrer">Inspect original ↗</a></figcaption></figure>
        </div>
      </section>}
    </div>
    <footer className={styles.notes}><p>Private creative review · AI-assisted pouch artwork · {reviewStatus}. No shopping or checkout is connected.</p><details><summary>Production notes</summary><p>The Store header presents the brand range. The three A+ modules use one gummy pouch direction. Confirm exact label artwork, candy identity, pack count, weight and target ASIN before upload. These exports are not listing main images. Preview lettering is a layout approximation; the pouch reference remains the packaging identity source. No Amazon publication has been made.</p></details></footer>
  </main>;
}
