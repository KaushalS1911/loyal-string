import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { ProductEditView } from '../../../../../sections/product/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Product',
};

export default function ProductEditPage({ params }) {
  const { id } = params;

  return <ProductEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

ProductEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
