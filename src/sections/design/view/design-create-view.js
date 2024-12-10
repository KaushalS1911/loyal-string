'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DesignNewEditForm from '../design-new-edit-form';

// ----------------------------------------------------------------------

export default function DesignCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Design'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Design',
            href: paths.dashboard.design.list,
          },
          { name: 'New Design' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DesignNewEditForm />
    </Container>
  );
}
