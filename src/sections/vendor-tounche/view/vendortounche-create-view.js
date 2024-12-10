'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import VendorTouncheNewEditForm from '../vendortounche-new-edit-form';

// ----------------------------------------------------------------------

export default function VendorTouncheCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new VendorTounche'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'VendorTounche',
            href: paths.dashboard.vendortounche.list,
          },
          { name: 'New VendorTounche' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <VendorTouncheNewEditForm />
    </Container>
  );
}
