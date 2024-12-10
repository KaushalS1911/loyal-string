import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { StoneEditView } from '../../../../../sections/stone/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Stone',
};

export default function StoneEditPage({ params }) {
  const { id } = params;

  return <StoneEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

StoneEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
