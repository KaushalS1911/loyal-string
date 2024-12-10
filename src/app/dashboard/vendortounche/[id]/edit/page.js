import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { VendorTouncheEditView } from '../../../../../sections/vendor-tounche/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: VendorTounche',
};

export default function VendorTouncheEditPage({ params }) {
  const { id } = params;

  return <VendorTouncheEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

VendorTouncheEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
