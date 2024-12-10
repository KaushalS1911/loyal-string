import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { CustomerTouncheEditView } from '../../../../../sections/customer-tounche/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: CustomerTounche',
};

export default function CustomerTouncheEditPage({ params }) {
  const { id } = params;

  return <CustomerTouncheEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

CustomerTouncheEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
