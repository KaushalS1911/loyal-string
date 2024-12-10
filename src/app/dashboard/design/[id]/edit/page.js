import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { DesignEditView } from '../../../../../sections/design/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Design',
};

export default function DesignEditPage({ params }) {
  const { id } = params;

  return <DesignEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

DesignEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
