'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomerNewEditForm from '../customer-new-edit-form';

// ----------------------------------------------------------------------

export default function CustomerCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Customer'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Customer',
            href: paths.dashboard.customer.list,
          },
          { name: 'New Customer' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <CustomerNewEditForm />
    </Container>
  );
}
