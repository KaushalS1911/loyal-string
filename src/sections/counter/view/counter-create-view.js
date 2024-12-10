'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CounterNewEditForm from '../counter-new-edit-form';

// ----------------------------------------------------------------------

export default function CounterCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Counter'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Branch',
            href: paths.dashboard.counter.list,
          },
          { name: 'New Counter' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CounterNewEditForm />
    </Container>
  );
}
