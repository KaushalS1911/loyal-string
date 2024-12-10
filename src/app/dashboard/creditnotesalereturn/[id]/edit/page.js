import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { CreditNoteSaleReturnEditView } from '../../../../../sections/credit-note-sale-return/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: CreditNotesalereturn',
};

export default function CreditNotesalereturnEditPage({ params }) {
  const { id } = params;

  return <CreditNoteSaleReturnEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

CreditNotesalereturnEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
