'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import BankAccountNewEditForm from '../bankAccount-new-edit-form';

// ----------------------------------------------------------------------

export default function BankAccountCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Bank Account'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'BankAccount',
            href: paths.dashboard.bankaccount.list,
          },
          { name: 'New Bank Account' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BankAccountNewEditForm />
    </Container>
  );
}
