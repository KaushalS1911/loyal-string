import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { CategoryEditView } from '../../../../../sections/category/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Category',
};

export default function CategoryEditPage({ params }) {
  const { id } = params;

  return <CategoryEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

CategoryEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
