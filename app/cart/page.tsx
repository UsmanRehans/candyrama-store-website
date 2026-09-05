import { CartPageClient } from '@/components/cart-page-client';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';
export const metadata = { title: 'Your Bag | CandyRama' };
export default function CartPage() { return <main><StoreHeader /><CartPageClient /><StoreFooter /></main>; }
