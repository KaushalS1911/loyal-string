import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import VendorEditView from '../../../../../sections/vendor/view/vendor-edit-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Vendor Edit',
};

export default function VendorEditPage({ params }) {
  const { id } = params;

  return <VendorEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user._id,
  }));
}

VendorEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
