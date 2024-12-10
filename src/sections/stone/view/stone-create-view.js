'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import StoneNewEditForm from '../stone-new-edit-form';

// ----------------------------------------------------------------------

export default function StoneCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Stone'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Stone',
            href: paths.dashboard.stone.list,
          },
          { name: 'New Stone' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StoneNewEditForm />
    </Container>
  );
}
