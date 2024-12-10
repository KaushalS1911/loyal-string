'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import RolesNewEditForm from '../roles-new-edit-form';

// ----------------------------------------------------------------------

export default function RolesEditView({ id }) {
  const settings = useSettingsContext();

  const currentRoles = _userList.find((user) => user.id === id);

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
            name: 'Roles',
            href: paths.dashboard.roles.list,
          },
          { name: currentRoles?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RolesNewEditForm currentRoles={currentRoles} />
    </Container>
  );
}

RolesEditView.propTypes = {
  id: PropTypes.string,
};
