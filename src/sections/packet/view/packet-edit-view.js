'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import PacketNewEditForm from '../packet-new-edit-form';
import { useGetPacket } from '../../../api/packet';

// ----------------------------------------------------------------------

export default function PacketEditView({ id }) {
  const settings = useSettingsContext();
  const { packet } = useGetPacket();
  const currentPacket = packet.find((user) => user._id === id);

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
      {currentPacket && <PacketNewEditForm currentPacket={currentPacket} />}
    </Container>
  );
}

PacketEditView.propTypes = {
  id: PropTypes.string,
};
