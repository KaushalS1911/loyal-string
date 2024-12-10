'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CreatePacketNewEditForm from '../createpacket-new-edit-form';

// ----------------------------------------------------------------------

export default function CreatePacketCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new CreatePacket'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'CreatePacket',
            href: paths.dashboard.company.list,
          },
          { name: 'New CreatePacket' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CreatePacketNewEditForm />
    </Container>
  );
}
