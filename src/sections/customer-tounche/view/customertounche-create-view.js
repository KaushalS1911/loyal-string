'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomerTouncheNewEditForm from '../customertounche-new-edit-form';

// ----------------------------------------------------------------------

export default function CustomerTouncheCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new CustomerTounche'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'CustomerTounche',
            href: paths.dashboard.customertounche.list,
          },
          { name: 'New CustomerTounche' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CustomerTouncheNewEditForm />
    </Container>
  );
}
