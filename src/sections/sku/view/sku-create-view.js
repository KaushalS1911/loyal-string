'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SkuNewEditForm from '../sku-new-edit-form';

// ----------------------------------------------------------------------

export default function SkuCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Sku'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Sku',
            href: paths.dashboard.sku.list,
          },
          { name: 'New Sku' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SkuNewEditForm />
    </Container>
  );
}
