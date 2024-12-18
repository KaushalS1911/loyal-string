'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DimondSizeWeightRateNewEditForm from '../diamondSizeWeightRate-new-edit-form';
import { useGetDiamondSizeWeightRate } from '../../../api/diamond-size-weight-rate';

// ----------------------------------------------------------------------

export default function DiamondSizeWeightRateEditView({ id }) {
  const settings = useSettingsContext();
  const { diamondSizeWeightRate } = useGetDiamondSizeWeightRate();
  const currentDiamondSizeWeightRate = diamondSizeWeightRate.find((user) => user._id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Edit'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Dimond Size/Weight Rate',
            href: paths.dashboard.diamondsizeweightrate.list,
          },
          { name: currentDiamondSizeWeightRate?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentDiamondSizeWeightRate &&
      <DimondSizeWeightRateNewEditForm currentDiamondSizeWeightRate={currentDiamondSizeWeightRate} />}
    </Container>
  );
}

DiamondSizeWeightRateEditView.propTypes = {
  id: PropTypes.string,
};
