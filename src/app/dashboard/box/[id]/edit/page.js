import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { BoxEditView } from '../../../../../sections/box/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Box',
};

export default function BoxEditPage({ params }) {
  const { id } = params;

  return <BoxEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

BoxEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
