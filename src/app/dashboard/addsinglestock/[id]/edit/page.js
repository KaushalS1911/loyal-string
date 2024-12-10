import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { AddSingleStockEditView } from '../../../../../sections/add-single-stock/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: AddSingleStock',
};

export default function AddSingleStockEditPage({ params }) {
  const { id } = params;

  return <AddSingleStockEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

AddSingleStockEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
