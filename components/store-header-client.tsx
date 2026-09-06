'use client';

import Link from 'next/link';
import { CircleUserRound, Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CartCount } from './cart-count';
import { openEmailSignup } from './email-signup-popup';

function HeaderWordmark() {
  return (
    <span className="wordmark">
      <span>CANDY</span>
      <span>RAMA</span>
    </span>
  );
}

export function StoreHeaderClient() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', menuOpen);
    return () => document.body.classList.remove('mobile-menu-open');
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <div className="announcement">
        FREE SHIPPING ON ORDERS $50+ <span>★</span> PACKED BY HAND{' '}
        <span>★</span> MADE IN TEXAS
      </div>
      <header className="site-header">
        <Link
          href="/"
          className="brand"
          aria-label="CandyRama home"
          onClick={closeMenu}
        >
          <HeaderWordmark />
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/shop">Shop</Link>
          <Link href="/about">Our story</Link>
          <Link href="/#find-us">Find us</Link>
          <Link href="/wholesale">Wholesale</Link>
          <button type="button" onClick={openEmailSignup}>
            Join and save
          </button>
        </nav>
        <div className="header-actions">
          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <Link
            href="/account"
            className="account-button"
            aria-label="My account"
          >
            <CircleUserRound />
            <span>Account</span>
          </Link>
          <Link href="/cart" className="cart-button" aria-label="Shopping bag">
            <ShoppingBag />
            <CartCount />
          </Link>
        </div>
      </header>
      <div
        className={menuOpen ? 'mobile-navigation open' : 'mobile-navigation'}
        id="mobile-navigation"
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          <Link href="/shop" onClick={closeMenu}>
            Shop candy
          </Link>
          <Link href="/about" onClick={closeMenu}>
            Our story
          </Link>
          <Link href="/#find-us" onClick={closeMenu}>
            Find us
          </Link>
          <Link href="/wholesale" onClick={closeMenu}>
            Wholesale
          </Link>
          <Link href="/account" onClick={closeMenu}>
            My account
          </Link>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              openEmailSignup();
            }}
          >
            Join and save
          </button>
        </nav>
      </div>
    </>
  );
}
