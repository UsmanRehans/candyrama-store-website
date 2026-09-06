import { CustomerAccount } from '@/components/customer-account';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';

export const metadata = {
  title: 'My account | CandyRama',
  description: 'Sign in to see your CandyRama orders and Sugar Points.',
};

export default function AccountPage() {
  return (
    <main>
      <StoreHeader />
      <CustomerAccount />
      <StoreFooter />
    </main>
  );
}
