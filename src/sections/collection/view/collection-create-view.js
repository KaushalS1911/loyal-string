'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CollectionNewEditForm from '../collection-new-edit-form';

// ----------------------------------------------------------------------

export default function CollectionCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Collection'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Collection',
            href: paths.dashboard.collection.list,
          },
          { name: 'New Collection' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CollectionNewEditForm />
    </Container>
  );
}
