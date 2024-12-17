'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomerNewEditForm from '../customer-new-edit-form';
import { useGetCustomer } from '../../../api/customer';

// ----------------------------------------------------------------------

export default function CustomerEditView({ id }) {
  const settings = useSettingsContext();
  const { customer } = useGetCustomer();
  const currentCustomer = customer.find((user) => user._id === id);

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
            name: 'Customer',
            href: paths.dashboard.customer.list,
          },
          { name: currentCustomer?.firstName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentCustomer && customer && <CustomerNewEditForm currentCustomer={currentCustomer} />}
    </Container>
  );
}

CustomerEditView.propTypes = {
  id: PropTypes.string,
};
