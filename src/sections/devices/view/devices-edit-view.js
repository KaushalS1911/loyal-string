'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DevicesNewEditForm from '../devices-new-edit-form';
import { useGetDevice } from '../../../api/devices';

// ----------------------------------------------------------------------

export default function DevicesEditView({ id }) {
  const settings = useSettingsContext();
  const { devices } = useGetDevice();
  const currentDevices = devices.find((user) => user._id === id);

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
      {currentDevices && devices && <DevicesNewEditForm currentDevices={currentDevices} />}
    </Container>
  );
}

DevicesEditView.propTypes = {
  id: PropTypes.string,
};
