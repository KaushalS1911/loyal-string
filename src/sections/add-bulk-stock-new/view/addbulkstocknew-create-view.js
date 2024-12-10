'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import AddBulkStockNewNewEditForm from '../addbulkstocknew-new-edit-form';

// ----------------------------------------------------------------------

export default function AddBulkStockNewCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new AddBulkStockNew'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'AddBulkStockNew',
            href: paths.dashboard.addbulkstocknew.list,
          },
          { name: 'New AddBulkStockNew' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AddBulkStockNewNewEditForm />
    </Container>
  );
}
