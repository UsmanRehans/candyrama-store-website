import { PrismaClient, Category, ProductStatus } from '@prisma/client';

const db = new PrismaClient();
const products = [
  ['blue-raspberry-blast','Blue Raspberry Blast',Category.SOUR,'Electric blue raspberry with a puckery finish',800,24,'/generated/blue-sour-cutout.png','#2EC5FF'],
  ['rainbow-sour-mix','Rainbow Sour Mix',Category.SOUR,'Belts, rings and drops with maximum zing',800,24,'/generated/rainbow-sour-cutout.png','#EA537B'],
  ['chamoy-heatwave','Chamoy Heatwave',Category.SPICY,'Sweet fruit gummies with a chili-lime kick',1199,18,'/generated/chamoy-cutout.png','#FFD23F'],
  ['brownie-brittle','Brownie Brittle',Category.BRITTLE,'Thin, crispy and loaded with chocolate',1200,18,'/generated/brittle-cutout.png','#B5622A'],
] as const;

async function main() {
  for (const [slug,name,category,tagline,priceCents,stockQty,url,accentColor] of products) {
    await db.product.upsert({ where: { slug }, update: { name,category,tagline,priceCents,stockQty,status:ProductStatus.ACTIVE,accentColor }, create: { slug,name,category,tagline,description:tagline,ingredients:'See product label for current ingredients.',allergens:['Made in a shared facility'],netWeight:'8 oz (227g)',priceCents,stockQty,status:ProductStatus.ACTIVE,accentColor,images:{create:{storagePath:url,url,alt:name}} } });
  }
}
void main().finally(() => db.$disconnect());
