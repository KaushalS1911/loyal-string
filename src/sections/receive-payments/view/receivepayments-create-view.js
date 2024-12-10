'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ReceivePaymentsNewEditForm from '../receivepayments-new-edit-form';

// ----------------------------------------------------------------------

export default function ReceivePaymentsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new ReceivePayments'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'ReceivePayments',
            href: paths.dashboard.receivepayments.list,
          },
          { name: 'New ReceivePayments' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ReceivePaymentsNewEditForm />
    </Container>
  );
}
