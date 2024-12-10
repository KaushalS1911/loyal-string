import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { PurchaseEntryEditView } from '../../../../../sections/purchase-entry/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Purchase Entry Edit',
};

export default function PurchaseEntryEditPage({ params }) {
  const { id } = params;

  return <PurchaseEntryEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

PurchaseEntryEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
