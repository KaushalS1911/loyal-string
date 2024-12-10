import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { SkuEditView } from '../../../../../sections/sku/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Sku',
};

export default function SkuEditPage({ params }) {
  const { id } = params;

  return <SkuEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

SkuEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
