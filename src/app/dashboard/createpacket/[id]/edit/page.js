import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { CreatePacketEditView } from '../../../../../sections/create-packet/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: CreatePacket',
};

export default function CreatePacketEditPage({ params }) {
  const { id } = params;

  return <CreatePacketEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

CreatePacketEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
