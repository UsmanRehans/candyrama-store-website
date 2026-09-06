export type StorefrontProduct = {
  slug: string;
  name: string;
  category: string;
  note: string;
  price: string;
  priceCents: number;
  image: string;
  tone: string;
  badge?: string;
  netWeight?: string;
  available?: boolean;
  variantSku?: string;
};

export const products: StorefrontProduct[] = [
  {
    slug: 'blue-raspberry-blast',
    name: 'Blue Raspberry Blast',
    category: 'Sour',
    note: 'Electric blue raspberry with a puckery finish',
    price: '$8.00',
    priceCents: 800,
    image: '/generated/blue-sour-cutout.png',
    tone: 'sky',
    badge: 'Best seller',
  },
  {
    slug: 'rainbow-sour-mix',
    name: 'Rainbow Sour Mix',
    category: 'Sour',
    note: 'Belts, rings and drops with maximum zing',
    price: '$8.00',
    priceCents: 800,
    image: '/generated/rainbow-sour-cutout.png',
    tone: 'pink',
    badge: 'Fan favorite',
  },
  {
    slug: 'chamoy-heatwave',
    name: 'Chamoy Heatwave',
    category: 'Spicy',
    note: 'Sweet fruit gummies with a chili-lime kick',
    price: '$11.99',
    priceCents: 1199,
    image: '/generated/chamoy-cutout.png',
    tone: 'yellow',
    badge: 'Hot stuff',
  },
  {
    slug: 'brownie-brittle',
    name: 'Brownie Brittle',
    category: 'Brittle',
    note: 'Thin, crispy and loaded with chocolate',
    price: '$12.00',
    priceCents: 1200,
    image: '/generated/brittle-cutout.png',
    tone: 'copper',
  },
  {
    slug: 'gummy-bear-party',
    name: 'Gummy Bear Party',
    category: 'Sweet',
    note: 'Classic fruit gummies in every happy color',
    price: '$6.99',
    priceCents: 699,
    image: '/generated/rainbow-sour-cutout.png',
    tone: 'lime',
  },
  {
    slug: 'sour-oozie-drops',
    name: 'Sour Oozie Drops',
    category: 'Sour',
    note: 'Soft-centered drops dusted with sour sparkle',
    price: '$10.99',
    priceCents: 1099,
    image: '/generated/blue-sour-cutout.png',
    tone: 'plum',
  },
  {
    slug: 'chocolate-crunch-bark',
    name: 'Chocolate Crunch Bark',
    category: 'Bark',
    note: 'Deep chocolate, crispy bits and big crunch',
    price: '$15.99',
    priceCents: 1599,
    image: '/generated/brittle-cutout.png',
    tone: 'cream',
  },
  {
    slug: 'spicy-gummy-bears',
    name: 'Spicy Gummy Bears',
    category: 'Spicy',
    note: 'Juicy bears tossed in chamoy and chili',
    price: '$9.99',
    priceCents: 999,
    image: '/generated/chamoy-cutout.png',
    tone: 'orange',
  },
];
