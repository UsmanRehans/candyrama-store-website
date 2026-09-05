import type { Metadata } from 'next';
import { Anton, Luckiest_Guy, Nunito } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart-provider';

const nunito = Nunito({ variable: '--font-nunito', subsets: ['latin'] });
const anton = Anton({ variable: '--font-anton', subsets: ['latin'], weight: '400' });
const luckiest = Luckiest_Guy({ variable: '--font-luckiest', subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: 'CandyRama | Turn Up the Taste-o-Rama',
  description: 'Small-batch candy made in Texas. Gummies, brittle, sweet stuff and sour stuff—packed with drama.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${nunito.variable} ${anton.variable} ${luckiest.variable}`}><CartProvider>{children}</CartProvider></body></html>;
}
