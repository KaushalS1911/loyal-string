import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { AddBulkStockNewEditView } from '../../../../../sections/add-bulk-stock-new/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: AddBulkStockNew',
};

export default function AddBulkStockNewEditPage({ params }) {
  const { id } = params;

  return <AddBulkStockNewEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

AddBulkStockNewEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
