import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { CounterEditView } from '../../../../../sections/counter/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Counter Edit',
};

export default function CounterEditPage({ params }) {
  const { id } = params;

  return <CounterEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

CounterEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
