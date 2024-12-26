'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomerTouncheNewEditForm from '../customertounche-new-edit-form';
import { useGetCustomerTounche } from '../../../api/customer-tounche';

// ----------------------------------------------------------------------

export default function CustomerTouncheEditView({ id }) {
  const settings = useSettingsContext();
  const { customerTounche } = useGetCustomerTounche();
  const currentCustomerTounche = customerTounche.find((user) => user._id === id);

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
          { name: currentCustomerTounche?.customer?.firstName + ' ' + currentCustomerTounche?.customer?.lastName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentCustomerTounche && <CustomerTouncheNewEditForm currentCustomerTounche={currentCustomerTounche} />}
    </Container>
  );
}

CustomerTouncheEditView.propTypes = {
  id: PropTypes.string,
};
