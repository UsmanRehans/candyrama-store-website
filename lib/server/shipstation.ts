import 'server-only';
import { env, requireEnv } from './env';

type ShipStationLabel = {
  status: string;
  carrier_code: string;
  service_code: string;
  tracking_number: string;
  label_download?: { href?: string; pdf?: string };
};

export async function buyCheapestLabel(
  orderNumber: string,
  to: { name: string; phone?: string | null; street1: string; street2?: string | null; city: string; state: string; zip: string; country: string },
  weightOz: number,
) {
  const response = await fetch('https://api.shipstation.com/v2/labels/rate_shopper_id/cheapest', {
    method: 'POST',
    headers: { 'API-Key': requireEnv('SHIPSTATION_API_KEY'), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shipment: {
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
        packages: [{
          weight: { value: Math.max(8, weightOz), unit: 'ounce' },
          dimensions: { length: 10, width: 8, height: 4, unit: 'inch' },
        }],
      },
      label_format: 'pdf',
      label_layout: '4x6',
      label_download_type: 'url',
      display_scheme: 'label',
    }),
  });
  if (!response.ok) throw new Error(`ShipStation request failed (${response.status})`);
  const label = await response.json() as ShipStationLabel;
  const labelUrl = label.label_download?.href ?? label.label_download?.pdf;
  if (label.status !== 'completed' || !label.tracking_number || !labelUrl) throw new Error('ShipStation label purchase failed');
  return { carrier: label.carrier_code, serviceLevel: label.service_code, trackingNumber: label.tracking_number, labelUrl };
}
