'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DebitNoteSaleReturnNewEditForm from '../debitnotesalereturn-new-edit-form';

// ----------------------------------------------------------------------

export default function DebitNoteSaleReturnCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new DebitNoteSaleReturn'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'DebitNoteSaleReturn',
            href: paths.dashboard.debitnotesalereturn.list,
          },
          { name: 'New DebitNoteSaleReturn' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DebitNoteSaleReturnNewEditForm />
    </Container>
  );
}
