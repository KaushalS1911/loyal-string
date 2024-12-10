'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import MakePaymentsNewEditForm from '../makepayments-new-edit-form';

// ----------------------------------------------------------------------

export default function MakePaymentsEditView({ id }) {
  const settings = useSettingsContext();

  const currentMakePayments = _userList.find((user) => user.id === id);

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
            name: 'MakePayments',
            href: paths.dashboard.makepayments.list,
          },
          { name: currentMakePayments?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <MakePaymentsNewEditForm currentMakePayments={currentMakePayments} />
    </Container>
  );
}

MakePaymentsEditView.propTypes = {
  id: PropTypes.string,
};
