import 'server-only';
import { env, requireEnv } from './env';

type ShipStationLabel = {
  status: string;
  carrier_code: string;
  service_code: string;
  tracking_number: string;
  label_download?: { href?: string; pdf?: string };
};

type ShipTo = {
  name: string;
  phone?: string | null;
  street1: string;
  street2?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export function missingShippingOriginFields() {
  return (
    [
      ['SHIP_FROM_PHONE', env.SHIP_FROM_PHONE],
      ['SHIP_FROM_STREET1', env.SHIP_FROM_STREET1],
      ['SHIP_FROM_CITY', env.SHIP_FROM_CITY],
      ['SHIP_FROM_STATE', env.SHIP_FROM_STATE],
      ['SHIP_FROM_ZIP', env.SHIP_FROM_ZIP],
    ] as const
  )
    .filter(([, value]) => !value)
    .map(([name]) => name);
}

function shipment(orderNumber: string, to: ShipTo, weightOz: number) {
  return {
    external_order_id: orderNumber,
    external_shipment_id: orderNumber,
    ship_date: new Date().toISOString().slice(0, 10),
    ship_to: {
      name: to.name,
      ...(to.phone ? { phone: to.phone } : {}),
      address_line1: to.street1,
      ...(to.street2 ? { address_line2: to.street2 } : {}),
      city_locality: to.city,
      state_province: to.state,
      postal_code: to.zip,
      country_code: to.country,
      address_residential_indicator: 'unknown',
    },
    ship_from: {
      name: env.SHIP_FROM_NAME,
      company_name: env.SHIP_FROM_NAME,
      phone: requireEnv('SHIP_FROM_PHONE'),
      address_line1: requireEnv('SHIP_FROM_STREET1'),
      city_locality: requireEnv('SHIP_FROM_CITY'),
      state_province: requireEnv('SHIP_FROM_STATE'),
      postal_code: requireEnv('SHIP_FROM_ZIP'),
      country_code: 'US',
      address_residential_indicator: 'no',
    },
    packages: [
      {
        weight: { value: Math.max(8, weightOz), unit: 'ounce' },
        dimensions: { length: 10, width: 8, height: 4, unit: 'inch' },
      },
    ],
  };
}

export async function quoteCheapestLabel(
  orderNumber: string,
  to: ShipTo,
  weightOz: number,
) {
  const apiKey = requireEnv('SHIPSTATION_API_KEY');
  const carriersResponse = await fetch(
    'https://api.shipstation.com/v2/carriers',
    { headers: { 'API-Key': apiKey }, cache: 'no-store' },
  );
  if (!carriersResponse.ok)
    throw new Error(
      `ShipStation carrier request failed (${carriersResponse.status})`,
    );
  const carrierPayload = (await carriersResponse.json()) as {
    carriers?: Array<{ carrier_id?: string }>;
  };
  const carrierIds = (carrierPayload.carriers ?? [])
    .map((carrier) => carrier.carrier_id)
    .filter((id): id is string => Boolean(id));
  if (carrierIds.length === 0)
    throw new Error('No ShipStation carriers are connected.');

  const response = await fetch('https://api.shipstation.com/v2/rates', {
    method: 'POST',
    headers: { 'API-Key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shipment: shipment(orderNumber, to, weightOz),
      rate_options: { carrier_ids: carrierIds },
    }),
  });
  if (!response.ok)
    throw new Error(`ShipStation rate request failed (${response.status})`);
  const payload = (await response.json()) as {
    rate_response?: {
      rates?: Array<{
        carrier_friendly_name?: string;
        carrier_code?: string;
        service_type?: string;
        service_code?: string;
        shipping_amount?: { amount?: number; currency?: string };
        delivery_days?: number;
      }>;
    };
  };
  const rates = payload.rate_response?.rates ?? [];
  const cheapest = rates
    .filter((rate) => typeof rate.shipping_amount?.amount === 'number')
    .sort(
      (a, b) =>
        (a.shipping_amount?.amount ?? Infinity) -
        (b.shipping_amount?.amount ?? Infinity),
    )[0];
  if (!cheapest) throw new Error('ShipStation returned no usable rates.');
  return {
    carrier:
      cheapest.carrier_friendly_name ?? cheapest.carrier_code ?? 'Carrier',
    serviceLevel: cheapest.service_type ?? cheapest.service_code ?? 'Service',
    amount: cheapest.shipping_amount!.amount!,
    currency: cheapest.shipping_amount?.currency ?? 'usd',
    deliveryDays: cheapest.delivery_days ?? null,
    rateCount: rates.length,
  };
}

export async function buyCheapestLabel(
  orderNumber: string,
  to: ShipTo,
  weightOz: number,
) {
  const response = await fetch(
    'https://api.shipstation.com/v2/labels/rate_shopper_id/cheapest',
    {
      method: 'POST',
      headers: {
        'API-Key': requireEnv('SHIPSTATION_API_KEY'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shipment: shipment(orderNumber, to, weightOz),
        label_format: 'pdf',
        label_layout: '4x6',
        label_download_type: 'url',
        display_scheme: 'label',
      }),
    },
  );
  if (!response.ok)
    throw new Error(`ShipStation request failed (${response.status})`);
  const label = (await response.json()) as ShipStationLabel;
  const labelUrl = label.label_download?.href ?? label.label_download?.pdf;
  if (label.status !== 'completed' || !label.tracking_number || !labelUrl)
    throw new Error('ShipStation label purchase failed');
  return {
    carrier: label.carrier_code,
    serviceLevel: label.service_code,
    trackingNumber: label.tracking_number,
    labelUrl,
  };
}
