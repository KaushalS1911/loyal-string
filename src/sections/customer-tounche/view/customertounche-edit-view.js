'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomerTouncheNewEditForm from '../customertounche-new-edit-form';

// ----------------------------------------------------------------------

export default function CustomerTouncheEditView({ id }) {
  const settings = useSettingsContext();

  const currentCustomerTounche = _userList.find((user) => user.id === id);

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
            name: 'CustomerTounche',
            href: paths.dashboard.customertounche.list,
          },
          { name: currentCustomerTounche?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CustomerTouncheNewEditForm currentCustomerTounche={currentCustomerTounche} />
    </Container>
  );
}

CustomerTouncheEditView.propTypes = {
  id: PropTypes.string,
};
