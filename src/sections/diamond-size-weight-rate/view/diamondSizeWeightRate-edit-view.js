'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DimondSizeWeightRateNewEditForm from '../diamondSizeWeightRate-new-edit-form';

// ----------------------------------------------------------------------

export default function DimondSizeWeightRateEditView({ id }) {
  const settings = useSettingsContext();

  const currentDimondSizeWeightRate = _userList.find((user) => user.id === id);

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
          { name: currentDimondSizeWeightRate?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DimondSizeWeightRateNewEditForm currentDimondSizeWeightRate={currentDimondSizeWeightRate} />
    </Container>
  );
}

DimondSizeWeightRateEditView.propTypes = {
  id: PropTypes.string,
};
