import Link from 'next/link';
import { Menu, ShoppingBag } from 'lucide-react';
import { CartCount } from './cart-count';

export function Wordmark({ footer = false }: { footer?: boolean }) {
  return <span className={`wordmark${footer ? ' footer-wordmark' : ''}`}><span>CANDY</span><span>RAMA</span></span>;
}

export function StoreHeader() {
  return <>
    <div className="announcement">FREE SHIPPING ON ORDERS $50+ <span>★</span> SMALL-BATCH <span>★</span> MADE IN TEXAS</div>
    <header className="site-header">
      <Link href="/" className="brand" aria-label="CandyRama home"><Wordmark /></Link>
      <nav aria-label="Main navigation"><Link href="/shop">Shop</Link><Link href="/about">Our story</Link><Link href="/#find-us">Find us</Link><Link href="/wholesale">Wholesale</Link></nav>
      <div className="header-actions"><button className="menu-button" aria-label="Open menu"><Menu /></button><Link href="/cart" className="cart-button" aria-label="Shopping bag"><ShoppingBag /><CartCount /></Link></div>
    </header>
  </>;
}

export function StoreFooter() {
  return <footer className="site-footer">
    <div className="footer-brand">
      <Wordmark footer />
      <p>More candy. More drama.</p>
      <p className="footer-description">Bold, tangy, and sweet treats packed with personality in Houston, Texas.</p>
    </div>
    <nav className="footer-column" aria-label="Footer shop navigation">
      <h2>Shop</h2>
      <Link href="/shop">All candy</Link>
      <Link href="/why-candyrama">Why CandyRama</Link>
      <Link href="/wholesale">Wholesale</Link>
    </nav>
    <nav className="footer-column" aria-label="Footer help navigation">
      <h2>Help</h2>
      <Link href="/faq">FAQ</Link>
      <Link href="/legal/shipping-returns">Shipping &amp; returns</Link>
      <Link href="/freshness-promise">Freshness promise</Link>
      <Link href="/allergens">Allergen info</Link>
      <Link href="/legal/privacy">Privacy policy</Link>
      <Link href="/legal/privacy-choices">Privacy choices</Link>
    </nav>
    <div className="footer-column footer-contact">
      <h2>Contact</h2>
      <address>9807 Harwin Dr, Suite R<br />Houston, TX 77036</address>
      <a href="mailto:customercare@twistedtreatz.com">customercare@twistedtreatz.com</a>
      <Link href="/contact">Send us a message</Link>
      <Link href="/careers">Careers</Link>
      <Link href="/investors">Investor relations</Link>
    </div>
    <div className="footer-bottom">
      <p>© 2026 CandyRama. All rights reserved.</p>
      <p>Made with sweetness in Houston, Texas.</p>
    </div>
  </footer>;
}
