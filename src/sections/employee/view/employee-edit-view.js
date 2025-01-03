'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import EmployeeNewEditForm from '../employee-new-edit-form';
import { useGetEmployee } from '../../../api/employee';

// ----------------------------------------------------------------------

export default function EmployeeEditView({ id }) {
  const settings = useSettingsContext();
  const { employee } = useGetEmployee();
  const currentEmployee = employee.find((user) => user._id === id);

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
            name: 'Employee',
            href: paths.dashboard.employee.list,
          },
          { name: currentEmployee?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentEmployee && employee && <EmployeeNewEditForm currentEmployee={currentEmployee} />}
    </Container>
  );
}

EmployeeEditView.propTypes = {
  id: PropTypes.string,
};
