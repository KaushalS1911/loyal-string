import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { PurityEditView } from '../../../../../sections/purity/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Purity',
};

export default function PurityEditPage({ params }) {
  const { id } = params;

  return <PurityEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

PurityEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
