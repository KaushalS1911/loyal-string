import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { BankAccountEditView } from '../../../../../sections/bank-account/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Bank Account ',
};

export default function BankAccountEditPage({ params }) {
  const { id } = params;

  return <BankAccountEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

BankAccountEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
