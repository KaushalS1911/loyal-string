'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import VendorTouncheNewEditForm from '../vendortounche-new-edit-form';
import { useGetVendorTounche } from '../../../api/vendor-tounche';

// ----------------------------------------------------------------------

export default function VendorTouncheEditView({ id }) {
  const settings = useSettingsContext();
  const { vendorTounche } = useGetVendorTounche();
  const currentVendorTounche = vendorTounche.find((user) => user._id === id);

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
            name: 'VendorTounche',
            href: paths.dashboard.vendortounche.list,
          },
          { name: currentVendorTounche?.vendor?.vendorName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentVendorTounche && <VendorTouncheNewEditForm currentVendorTounche={currentVendorTounche} />}
    </Container>
  );
}

VendorTouncheEditView.propTypes = {
  id: PropTypes.string,
};
