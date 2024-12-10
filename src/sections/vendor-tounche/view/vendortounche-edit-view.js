'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import VendorTouncheNewEditForm from '../vendortounche-new-edit-form';

// ----------------------------------------------------------------------

export default function VendorTouncheEditView({ id }) {
  const settings = useSettingsContext();

  const currentVendorTounche = _userList.find((user) => user.id === id);

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
          { name: currentVendorTounche?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <VendorTouncheNewEditForm currentVendorTounche={currentVendorTounche} />
    </Container>
  );
}

VendorTouncheEditView.propTypes = {
  id: PropTypes.string,
};
