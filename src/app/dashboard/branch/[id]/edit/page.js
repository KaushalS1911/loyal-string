import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { BranchEditView } from '../../../../../sections/branch/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Branch Edit',
};

export default function BranchEditPage({ params }) {
  const { id } = params;

  return <BranchEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

BranchEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
