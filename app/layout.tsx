import type { Metadata } from "next";
import {
  Anton,
  Bricolage_Grotesque,
  DM_Sans,
  Luckiest_Guy,
  Nunito,
} from "next/font/google";
import "./globals.css";
import "./candy-counter.css";
import "./candy-motion.css";
import "./candy-counter-signup.css";
import { CartProvider } from "@/components/cart-provider";
import { EmailSignupPopup } from "@/components/email-signup-popup";

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});
const luckiest = Luckiest_Guy({
  variable: "--font-luckiest",
  subsets: ["latin"],
  weight: "400",
});
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CandyRama | Turn Up the Taste-o-Rama",
  description:
    "Candy packed in Texas with big flavor and plenty of drama. Shop gummies, brittle, sweet stuff, and sour stuff.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${anton.variable} ${luckiest.variable} ${bricolage.variable} ${dmSans.variable}`}
      >
        <CartProvider>
          {children}
          <EmailSignupPopup />
        </CartProvider>
      </body>
    </html>
  );
}
