import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { DiamondSizeWeightRateEditView } from '../../../../../sections/diamond-size-weight-rate/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: DiamondSizeWeightRate',
};

export default function DiamondSizeWeightRateEditPage({ params }) {
  const { id } = params;

  return <DiamondSizeWeightRateEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

DiamondSizeWeightRateEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
