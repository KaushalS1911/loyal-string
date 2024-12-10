'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import TaxNewEditForm from '../tax-new-edit-form';

// ----------------------------------------------------------------------

export default function TaxCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Tax'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Tax',
            href: paths.dashboard.tax.list,
          },
          { name: 'New Tax' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TaxNewEditForm />
    </Container>
  );
}
