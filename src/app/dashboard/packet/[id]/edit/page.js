import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { PacketEditView } from '../../../../../sections/packet/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Packet',
};

export default function PacketEditPage({ params }) {
  const { id } = params;

  return <PacketEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

PacketEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
