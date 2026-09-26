import Link from "next/link";
import { InfoPage, InfoSection } from "@/components/info-page";

export const metadata = {
  title: "Allergen Information | Candy Rama",
  description:
    "How to review Candy Rama ingredient and allergen information before choosing or sharing candy.",
};

export default function AllergensPage() {
  return (
    <InfoPage
      eyebrow="KNOW BEFORE YOU BITE"
      title="Allergen information"
      intro="Ingredients and allergen risks vary. Always check the package you receive."
    >
      <div className="allergen-alert">
        <strong>The current label comes first</strong>
        <p>
          Read the full ingredient list and every “contains” or “may contain”
          statement before eating or sharing a product. Formulas and suppliers
          can change.
        </p>
      </div>
      <InfoSection title="Do not assume from the category">
        <p>
          Gummies, sour candy, spicy candy, bark, and brittle can contain
          different ingredients even when they look similar. A product name,
          color, or candy type is not enough to determine allergen safety.
        </p>
      </InfoSection>
      <InfoSection title="Severe allergies">
        <p>
          If you or the person eating the candy has a severe allergy, review the
          physical package carefully before opening it. Contact{" "}
          <a href="mailto:admin@thecandyrama.com">admin@thecandyrama.com</a> if
          you need help locating the available label information. We cannot
          promise an allergen-free product or environment.
        </p>
      </InfoSection>
      <InfoSection title="Dietary requirements">
        <p>
          Allergen information and dietary suitability are related, but they are
          not the same. See our{" "}
          <Link href="/dietary-information">dietary information page</Link> for
          kosher, halal, vegan, vegetarian, and gluten-free guidance.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
