'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import MakePaymentsNewEditForm from '../makepayments-new-edit-form';

// ----------------------------------------------------------------------

export default function MakePaymentsCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new MakePayments'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'MakePayments',
            href: paths.dashboard.makepayments.list,
          },
          { name: 'New MakePayments' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <MakePaymentsNewEditForm />
    </Container>
  );
}
