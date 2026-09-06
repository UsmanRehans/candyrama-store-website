import Link from 'next/link';
import { SignupButton } from './email-signup-popup';
import { StoreHeaderClient } from './store-header-client';

export function Wordmark({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`wordmark${footer ? ' footer-wordmark' : ''}`}>
      <span>CANDY</span>
      <span>RAMA</span>
    </span>
  );
}

export function StoreHeader() {
  return <StoreHeaderClient />;
}

export function StoreFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Wordmark footer />
        <p>More candy. More drama.</p>
        <p className="footer-description">
          Bold, tangy, and sweet treats packed with personality in Rosenberg,
          Texas.
        </p>
      </div>
      <nav className="footer-column" aria-label="Footer shop navigation">
        <h2>Shop</h2>
        <Link href="/shop">All candy</Link>
        <Link href="/pick-four">Pick four and save</Link>
        <Link href="/gifting">Gifting</Link>
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
        <Link href="/account">My account</Link>
      </nav>
      <div className="footer-column footer-contact">
        <h2>Contact</h2>
        <address>Rosenberg, Texas</address>
        <a href="mailto:admin@thecandyrama.com">admin@thecandyrama.com</a>
        <Link href="/contact">Send us a message</Link>
        <Link href="/careers">Careers</Link>
        <Link href="/investors">Investor relations</Link>
        <SignupButton className="footer-signup-button" />
      </div>
      <div className="footer-bottom">
        <p>© 2026 CandyRama. All rights reserved.</p>
        <p>Made with sweetness in Rosenberg, Texas.</p>
      </div>
    </footer>
  );
}
