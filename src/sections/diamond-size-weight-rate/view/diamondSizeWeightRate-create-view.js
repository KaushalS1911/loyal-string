'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DimondSizeWeightRateNewEditForm from '../diamondSizeWeightRate-new-edit-form';

// ----------------------------------------------------------------------

export default function DimondSizeWeightRateCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new DimondSizeWeightRate'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'DimondSizeWeightRate',
            href: paths.dashboard.diamondsizeweightrate.list,
          },
          { name: 'New Dimond Size/Weight Rate' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DimondSizeWeightRateNewEditForm />
    </Container>
  );
}
