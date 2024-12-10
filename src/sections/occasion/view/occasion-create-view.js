'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import OccasionNewEditForm from '../occasion-new-edit-form';

// ----------------------------------------------------------------------

export default function OccasionCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Occasion'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Occasion',
            href: paths.dashboard.occasion.list,
          },
          { name: 'New Occasion' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OccasionNewEditForm />
    </Container>
  );
}
