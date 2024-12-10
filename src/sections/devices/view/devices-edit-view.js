'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DevicesNewEditForm from '../devices-new-edit-form';

// ----------------------------------------------------------------------

export default function DevicesEditView({ id }) {
  const settings = useSettingsContext();

  const currentDevices = _userList.find((user) => user.id === id);

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
            name: 'Devices',
            href: paths.dashboard.devices.list,
          },
          { name: currentDevices?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DevicesNewEditForm currentDevices={currentDevices} />
    </Container>
  );
}

DevicesEditView.propTypes = {
  id: PropTypes.string,
};
