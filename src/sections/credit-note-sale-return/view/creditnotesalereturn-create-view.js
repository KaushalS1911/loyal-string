'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CreditNoteSaleReturnNewEditForm from '../creditnotesalereturn-new-edit-form';

// ----------------------------------------------------------------------

export default function CreditNoteSaleReturnCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new CreditNoteSaleReturn'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'CreditNoteSaleReturn',
            href: paths.dashboard.creditnotesalereturn.list,
          },
          { name: 'New CreditNoteSaleReturn' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CreditNoteSaleReturnNewEditForm />
    </Container>
  );
}
