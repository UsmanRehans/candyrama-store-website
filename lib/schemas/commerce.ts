import { z } from 'zod';

export const cartItemSchema = z.object({ productSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), quantity: z.number().int().min(1).max(20) });
export const checkoutSchema = z.object({ items: z.array(cartItemSchema).min(1).max(25), email: z.email().optional() });
export const orderLookupSchema = z.object({ email: z.email(), orderNumber: z.string().regex(/^CR-\d{6}$/) });
export const wholesaleSchema = z.object({ businessName: z.string().min(2).max(120), contactName: z.string().min(2).max(120), email: z.email(), phone: z.string().max(40).optional(), website: z.url().optional().or(z.literal('')), estimatedQuantity: z.string().min(1).max(50), message: z.string().max(2000).optional() });
export const contactSchema = z.object({ name: z.string().min(2).max(120), email: z.email(), subject: z.string().min(2).max(120), message: z.string().min(10).max(4000) });
