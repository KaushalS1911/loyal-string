'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DebitNoteSaleReturnNewEditForm from '../debitnotesalereturn-new-edit-form';

// ----------------------------------------------------------------------

export default function DebitNoteSaleReturnEditView({ id }) {
  const settings = useSettingsContext();

  const currentDebitNoteSaleReturn = _userList.find((user) => user.id === id);

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
            name: 'DebitNoteSaleReturn',
            href: paths.dashboard.debitnotesalereturn.list,
          },
          { name: currentDebitNoteSaleReturn?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DebitNoteSaleReturnNewEditForm currentDebitNoteSaleReturn={currentDebitNoteSaleReturn} />
    </Container>
  );
}

DebitNoteSaleReturnEditView.propTypes = {
  id: PropTypes.string,
};
