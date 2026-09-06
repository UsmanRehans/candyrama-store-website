import { z } from 'zod';

export const cartItemSchema = z.object({
  variantSku: z.string().min(1).max(180),
  quantity: z.number().int().min(1).max(20),
});
export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(25),
  email: z.email().optional(),
  giftRecipientName: z.string().trim().max(80).optional(),
  giftMessage: z.string().trim().max(300).optional(),
  referralCode: z.string().trim().toUpperCase().max(24).optional(),
  discountCode: z.string().trim().toUpperCase().max(24).optional(),
  useRewards: z.boolean().default(false),
});
export const newsletterSchema = z.object({
  email: z.email(),
  source: z.string().trim().min(1).max(60).default('homepage'),
});
export const orderLookupSchema = z.object({
  email: z.email(),
  orderNumber: z.string().regex(/^CR-\d{6}$/),
});
export const wholesaleSchema = z.object({
  businessName: z.string().min(2).max(120),
  contactName: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().max(40).optional(),
  website: z.url().optional().or(z.literal('')),
  estimatedQuantity: z.string().min(1).max(50),
  message: z.string().max(2000).optional(),
});
export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email(),
  subject: z.string().min(2).max(120),
  message: z.string().min(10).max(4000),
});
