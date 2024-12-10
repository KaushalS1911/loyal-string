'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ReceivePaymentsNewEditForm from '../receivepayments-new-edit-form';

// ----------------------------------------------------------------------

export default function ReceivePaymentsEditView({ id }) {
  const settings = useSettingsContext();

  const currentReceivePayments = _userList.find((user) => user.id === id);

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
            name: 'ReceivePayments',
            href: paths.dashboard.receivepayments.list,
          },
          { name: currentReceivePayments?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ReceivePaymentsNewEditForm currentReceivePayments={currentReceivePayments} />
    </Container>
  );
}

ReceivePaymentsEditView.propTypes = {
  id: PropTypes.string,
};
