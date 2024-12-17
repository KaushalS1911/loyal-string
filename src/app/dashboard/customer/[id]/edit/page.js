import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { CustomerEditView } from '../../../../../sections/customer/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Customer Edit',
};

export default function CustomerEditPage({ params }) {
  const { id } = params;

  return <CustomerEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

CustomerEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
