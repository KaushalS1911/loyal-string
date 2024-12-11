'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import BankAccountNewEditForm from '../bankAccount-new-edit-form';
import { useGetBankAccount } from '../../../api/bankaccount';

// ----------------------------------------------------------------------

export default function BankAccountEditView({ id }) {
  const settings = useSettingsContext();
  const { bankAccount } = useGetBankAccount();
  const currentBankAccount = bankAccount.find((user) => user._id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Edit'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Bank Account',
            href: paths.dashboard.bankaccount.list,
          },
          { name: currentBankAccount?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BankAccountNewEditForm currentBankAccount={currentBankAccount} />
    </Container>
  );
}

BankAccountEditView.propTypes = {
  id: PropTypes.string,
};
