import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { CollectionEditView } from '../../../../../sections/collection/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Collection',
};

export default function CollectionEditPage({ params }) {
  const { id } = params;

  return <CollectionEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

CollectionEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
