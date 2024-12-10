import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { MakePaymentsEditView } from '../../../../../sections/make-payments/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: MakePayments',
};

export default function MakePaymentsEditPage({ params }) {
  const { id } = params;

  return <MakePaymentsEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

MakePaymentsEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
