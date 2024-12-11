'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DepartmentNewEditForm from '../department-new-edit-form';
import { useGetDepartment } from '../../../api/department';

// ----------------------------------------------------------------------

export default function DepartmentEditView({ id }) {
  const settings = useSettingsContext();
  const { department } = useGetDepartment();
  const currentDepartment = department.find((user) => user._id === id);

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
            href: paths.dashboard.department.list,
          },
          { name: currentDepartment?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentDepartment && <DepartmentNewEditForm currentDepartment={currentDepartment} />}
    </Container>
  );
}

DepartmentEditView.propTypes = {
  id: PropTypes.string,
};
