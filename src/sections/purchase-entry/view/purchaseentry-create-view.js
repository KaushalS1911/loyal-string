'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import PurchaseEntryNewEditForm from '../purchaseentry-new-edit-form';

// ----------------------------------------------------------------------

export default function PurchaseEntryCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new PurchaseEntry'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'PurchaseEntry',
            href: paths.dashboard.purchaseentry.list,
          },
          { name: 'New PurchaseEntry' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PurchaseEntryNewEditForm />
    </Container>
  );
}
