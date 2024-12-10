'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CreatePacketNewEditForm from '../createpacket-new-edit-form';

// ----------------------------------------------------------------------

export default function CreatePacketEditView({ id }) {
  const settings = useSettingsContext();

  const currentCreatePacket = _userList.find((user) => user.id === id);

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
            name: 'CreatePacket',
            href: paths.dashboard.createpacket.list,
          },
          { name: currentCreatePacket?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CreatePacketNewEditForm currentCreatePacket={currentCreatePacket} />
    </Container>
  );
}

CreatePacketEditView.propTypes = {
  id: PropTypes.string,
};
