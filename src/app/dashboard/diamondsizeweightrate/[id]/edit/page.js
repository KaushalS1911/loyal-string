import PropTypes from 'prop-types';
import { _userList } from 'src/_mock/_user';
import { DimondSizeWeightRateEditView } from '../../../../../sections/diamond-size-weight-rate/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: DimondSizeWeightRate',
};

export default function DimondSizeWeightRateEditPage({ params }) {
  const { id } = params;

  return <DimondSizeWeightRateEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

DimondSizeWeightRateEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
