import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { StockTransferEditView } from '../../../../../sections/stock-transfer/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: StockTransfer',
};

export default function StockTransferEditPage({ params }) {
  const { id } = params;

  return <StockTransferEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

StockTransferEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
