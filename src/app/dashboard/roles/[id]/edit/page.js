import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { RolesEditView } from '../../../../../sections/roles/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Roles Edit',
};

export default function RolesEditPage({ params }) {
  const { id } = params;

  return <RolesEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

RolesEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
