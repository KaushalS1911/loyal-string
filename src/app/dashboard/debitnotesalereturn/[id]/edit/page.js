import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { DebitNoteSaleReturnEditView } from '../../../../../sections/debit-note-sale-return/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: DebitNoteSaleReturn',
};

export default function DebitNoteSaleReturnEditPage({ params }) {
  const { id } = params;

  return <DebitNoteSaleReturnEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

DebitNoteSaleReturnEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
