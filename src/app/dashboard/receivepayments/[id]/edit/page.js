import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { ReceivePaymentsEditView } from '../../../../../sections/receive-payments/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: ReceivePayments',
};

export default function ReceivePaymentsEditPage({ params }) {
  const { id } = params;

  return <ReceivePaymentsEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

ReceivePaymentsEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
