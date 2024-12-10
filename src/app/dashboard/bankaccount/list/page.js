import { RolesListView } from '../../../../sections/roles/view';
import { TaxListView } from '../../../../sections/tax/view';
import { RateConversionListView } from '../../../../sections/rate-conversion/view';
import { BankAccountListView } from '../../../../sections/bank-account/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Bank Account List',
};

export default function BankAccountListPage() {
  return <BankAccountListView />;
}
