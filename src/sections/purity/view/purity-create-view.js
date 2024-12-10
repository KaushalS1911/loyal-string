'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import PurityNewEditForm from '../purity-new-edit-form';

// ----------------------------------------------------------------------

export default function PurityCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Purity'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Purity',
            href: paths.dashboard.purity.list,
          },
          { name: 'New Purity' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PurityNewEditForm />
    </Container>
  );
}
