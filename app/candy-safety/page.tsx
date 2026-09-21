import Link from "next/link";
import { InfoPage, InfoSection } from "@/components/info-page";

export const metadata = {
  title: "Candy Safety & Care | Candy Rama",
  description:
    "Simple guidance for checking, storing, serving, and enjoying Candy Rama products safely.",
};

export default function CandySafetyPage() {
  return (
    <InfoPage
      eyebrow="ENJOY WITH CARE"
      title="Candy safety and care"
      intro="A few simple checks help keep every candy moment a good one."
    >
      <InfoSection title="Check the package first">
        <p>
          Do not eat candy from a package that is open, damaged, leaking, or
          missing its label. Contact us if an order arrives in that condition.
        </p>
      </InfoSection>
      <InfoSection title="Read before you share">
        <p>
          Check the current ingredient and allergen statements before serving
          candy to someone else. Visit our{" "}
          <Link href="/allergens">allergen page</Link> and{" "}
          <Link href="/dietary-information">dietary information page</Link> for
          more guidance.
        </p>
      </InfoSection>
      <InfoSection title="Choose age-appropriate candy">
        <p>
          Candy can be a choking hazard. Consider the size, shape, and texture
          of each piece, and supervise children appropriately. Keep candy away
          from very young children and pets.
        </p>
      </InfoSection>
      <InfoSection title="Store it well">
        <p>
          Follow the package directions. Unless the label says otherwise, keep
          candy sealed in a cool, dry place away from direct sunlight and heat.
        </p>
      </InfoSection>
      <InfoSection title="Questions or damaged products">
        <p>
          Contact{" "}
          <a href="mailto:admin@thecandyrama.com">admin@thecandyrama.com</a> and
          include the product name, order number when applicable, and a clear
          photo of the package.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
