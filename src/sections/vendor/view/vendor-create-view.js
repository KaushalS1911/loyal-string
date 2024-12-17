'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import VendorNewEditForm from '../vendor-new-edit-form';

// ----------------------------------------------------------------------

export default function VendorCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Vendor'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Vendor',
            href: paths.dashboard.vendor.list,
          },
          { name: 'New Vendor' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <VendorNewEditForm />
    </Container>
  );
}
