'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import RolesNewEditForm from '../roles-new-edit-form';
import { useGetRoles } from '../../../api/roles';

// ----------------------------------------------------------------------

export default function RolesEditView({ id }) {
  const settings = useSettingsContext();
  const { roles } = useGetRoles();
  const currentRoles = roles.find((user) => user._id === id);

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

      {currentRoles && <RolesNewEditForm currentRoles={currentRoles} />}
    </Container>
  );
}

RolesEditView.propTypes = {
  id: PropTypes.string,
};
