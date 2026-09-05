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
  return <footer><div><Wordmark footer /><p>More candy. More drama.</p></div><div className="footer-links"><Link href="/shop">Shop</Link><Link href="/about">About</Link><Link href="/wholesale">Wholesale</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link><Link href="/allergens">Allergens</Link><Link href="/legal/shipping-returns">Shipping</Link><Link href="/legal/privacy">Privacy</Link></div><p className="copyright">© 2026 CandyRama · Houston, Texas</p></footer>;
}
