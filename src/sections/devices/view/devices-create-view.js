'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DevicesNewEditForm from '../devices-new-edit-form';

// ----------------------------------------------------------------------

export default function DevicesCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Devices'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Devices',
            href: paths.dashboard.devices.list,
          },
          { name: 'New Devices' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DevicesNewEditForm />
    </Container>
  );
}
