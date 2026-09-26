import { InfoPage, InfoSection } from "@/components/info-page";

export const metadata = {
  title: "Dietary Information | Candy Rama",
  description:
    "How to check Candy Rama ingredients, allergens, and dietary suitability before choosing a product.",
};

export default function DietaryInformationPage() {
  return (
    <InfoPage
      eyebrow="WHAT TO KNOW"
      title="Dietary information"
      intro="Candy should be fun. The product label should make the important details clear."
    >
      <InfoSection title="Kosher and halal">
        <p>
          Candy Rama products are not sold as kosher or halal. Please do not
          rely on them for either dietary requirement.
        </p>
      </InfoSection>
      <InfoSection title="Ingredients vary by candy">
        <p>
          Ingredients, colors, flavors, and processing aids can differ between
          products and may change over time. Read the ingredient list on the
          package you receive before eating or sharing the candy.
        </p>
      </InfoSection>
      <InfoSection title="Other dietary needs">
        <p>
          Vegan, vegetarian, gluten-free, dairy-free, and other dietary
          suitability must be checked product by product. We do not treat a
          candy’s appearance or category as proof that it meets a dietary need.
        </p>
      </InfoSection>
      <InfoSection title="Need help reading a label?">
        <p>
          Email{" "}
          <a href="mailto:admin@thecandyrama.com">admin@thecandyrama.com</a>{" "}
          with the product name and your question. We can help you review the
          information available, but we cannot provide medical advice.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
