'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DepartmentNewEditForm from '../Department-new-edit-form';

// ----------------------------------------------------------------------

export default function DepartmentEditView({ id }) {
  const settings = useSettingsContext();

  const currentDepartment = _userList.find((user) => user.id === id);

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
            name: 'Department',
            href: paths.dashboard.branch.list,
          },
          { name: currentDepartment?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DepartmentNewEditForm currentDepartment={currentDepartment} />
    </Container>
  );
}

DepartmentEditView.propTypes = {
  id: PropTypes.string,
};
