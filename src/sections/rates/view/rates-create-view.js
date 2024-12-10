'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import RatesNewEditForm from '../rates-new-edit-form';

// ----------------------------------------------------------------------

export default function RatesCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Rates'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Rates',
            href: paths.dashboard.rates.list,
          },
          { name: 'New Rates' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RatesNewEditForm />
    </Container>
  );
}
