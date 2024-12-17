'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import VendorNewEditForm from '../vendor-new-edit-form';
import { useGetVendor } from '../../../api/vendor';

// ----------------------------------------------------------------------

export default function VendorEditView({ id }) {
  const settings = useSettingsContext();
  const { vendor } = useGetVendor();
  const currentVendor = vendor?.find((user) => user._id === id);

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
            name: 'Vendor',
            href: paths.dashboard.vendor.list,
          },
          { name: currentVendor?.vendorName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentVendor && <VendorNewEditForm currentVendor={currentVendor} />}
    </Container>
  );
}

VendorEditView.propTypes = {
  id: PropTypes.string,
};
