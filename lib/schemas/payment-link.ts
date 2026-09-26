import { z } from 'zod';

export const usStates = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
  'DC',
] as const;

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined);

export const paymentLinkItemSchema = z.object({
  variantSku: z.string().trim().min(1).max(180),
  quantity: z.number().int().min(1).max(20),
});

export const paymentLinkOrderSchema = z
  .object({
    requestId: z.uuid(),
    items: z.array(paymentLinkItemSchema).min(1).max(25),
    email: z.email().transform((value) => value.toLowerCase()),
    shipping: z.object({
      name: z.string().trim().min(2).max(120),
      line1: z.string().trim().min(3).max(160),
      line2: optionalTrimmed(160),
      city: z.string().trim().min(2).max(100),
      state: z.enum(usStates),
      zip: z
        .string()
        .trim()
        .regex(/^\d{5}(?:-\d{4})?$/, 'Enter a valid US ZIP code.'),
      country: z.literal('US'),
    }),
    giftRecipientName: optionalTrimmed(80),
    giftMessage: optionalTrimmed(300),
  })
  .superRefine((input, context) => {
    const quantities = new Map<string, number>();
    for (const item of input.items) {
      const quantity = (quantities.get(item.variantSku) ?? 0) + item.quantity;
      quantities.set(item.variantSku, quantity);
      if (quantity > 20) {
        context.addIssue({
          code: 'custom',
          path: ['items'],
          message: 'A product quantity cannot exceed 20.',
        });
        return;
      }
    }
  });

export type PaymentLinkOrderInput = z.infer<typeof paymentLinkOrderSchema>;
