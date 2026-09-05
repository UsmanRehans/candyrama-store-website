import { InfoPage } from '@/components/info-page';

const faqs = [
  ['Where do you ship?', 'We currently ship to all 50 U.S. states. International shipping is not available yet.'],
  ['How quickly will my order arrive?', 'Orders are usually packed within 1–2 business days. Standard delivery typically takes another 3–5 business days after the carrier receives your package.'],
  ['Is shipping free?', 'Yes—standard shipping is free when your merchandise total reaches $50. Other shipping options are calculated at checkout.'],
  ['Do you have gluten-free candy?', 'Some products are made without gluten ingredients, but everything is packed in a shared facility that handles wheat. Always review the individual product label before ordering.'],
  ['What allergens are handled in your facility?', 'Our facility handles peanuts, tree nuts, milk, eggs, wheat, soy, and sesame. Cross-contact is possible, so please contact us before ordering if you have a severe allergy.'],
  ['Can candy be returned?', 'For food-safety reasons, opened or consumed candy cannot be returned. If an order arrives damaged, incomplete, or incorrect, contact us within 48 hours and we’ll work to make it right.'],
  ['Do you offer event or bulk pricing?', 'Yes. Orders of 50 bags or more may qualify for special pricing for weddings, events, corporate gifts, or retail. Contact our wholesale team for details.'],
  ['How should I store my candy?', 'Keep candy sealed in a cool, dry place away from sunlight and humidity. Chocolate and brittle should never be left in a hot car or on a warm porch.'],
];

export const metadata = { title: 'Frequently Asked Questions | CandyRama' };
export default function FAQPage(){return <InfoPage eyebrow="THE SWEET DETAILS" title="Frequently asked questions" intro="Everything you need to know before the candy hits your doorstep."><div className="faq-list">{faqs.map(([q,a],i)=><details key={q} open={i===0}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></InfoPage>}
