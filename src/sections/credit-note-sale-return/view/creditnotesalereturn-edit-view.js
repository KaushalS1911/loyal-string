'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CreditNoteSaleReturnNewEditForm from '../creditnotesalereturn-new-edit-form';

// ----------------------------------------------------------------------

export default function CreditNoteSaleReturnEditView({ id }) {
  const settings = useSettingsContext();

  const currentCreditNoteSaleReturn = _userList.find((user) => user.id === id);

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
            name: 'CreditNoteSaleReturn',
            href: paths.dashboard.creditnotesalereturn.list,
          },
          { name: currentCreditNoteSaleReturn?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CreditNoteSaleReturnNewEditForm currentCreditNoteSaleReturn={currentCreditNoteSaleReturn} />
    </Container>
  );
}

CreditNoteSaleReturnEditView.propTypes = {
  id: PropTypes.string,
};
