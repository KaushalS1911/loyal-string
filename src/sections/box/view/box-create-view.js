'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import BoxNewEditForm from '../box-new-edit-form';

// ----------------------------------------------------------------------

export default function BoxCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Box'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Box',
            href: paths.dashboard.box.list,
          },
          { name: 'New Box' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BoxNewEditForm />
    </Container>
  );
}
