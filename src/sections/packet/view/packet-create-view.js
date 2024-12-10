'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import PacketNewEditForm from '../packet-new-edit-form';

// ----------------------------------------------------------------------

export default function PacketCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new Packet'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Packet',
            href: paths.dashboard.packet.list,
          },
          { name: 'New Packet' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PacketNewEditForm />
    </Container>
  );
}
