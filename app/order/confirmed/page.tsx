import Link from 'next/link';
import { OrderConfirmedClient } from '@/components/order-confirmed-client';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';
export const metadata = { title: 'Order received | CandyRama' };
export default function ConfirmedPage() { return <main><StoreHeader/><OrderConfirmedClient/><section className="cart-shell"><p className="eyebrow">SWEET SUCCESS</p><h1>Order received!</h1><div className="empty-cart"><p>Your payment was received. Check your inbox for the receipt and shipping updates.</p><Link className="button primary" href="/shop">Keep browsing</Link></div></section><StoreFooter/></main>; }
