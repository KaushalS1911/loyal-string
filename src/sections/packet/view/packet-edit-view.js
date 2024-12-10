'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import PacketNewEditForm from '../packet-new-edit-form';

// ----------------------------------------------------------------------

export default function PacketEditView({ id }) {
  const settings = useSettingsContext();

  const currentPacket = _userList.find((user) => user.id === id);

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
            name: 'Packet',
            href: paths.dashboard.packet.list,
          },
          { name: currentPacket?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PacketNewEditForm currentPacket={currentPacket} />
    </Container>
  );
}

PacketEditView.propTypes = {
  id: PropTypes.string,
};
