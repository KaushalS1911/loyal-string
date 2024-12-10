import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { DevicesEditView } from '../../../../../sections/devices/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Devices Edit',
};

export default function DevicesEditPage({ params }) {
  const { id } = params;

  return <DevicesEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

DevicesEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
