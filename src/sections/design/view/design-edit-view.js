'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DesignNewEditForm from '../design-new-edit-form';

// ----------------------------------------------------------------------

export default function DesignEditView({ id }) {
  const settings = useSettingsContext();

  const currentDesign = _userList.find((user) => user.id === id);

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
            name: 'Design',
            href: paths.dashboard.design.list,
          },
          { name: currentDesign?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DesignNewEditForm currentDesign={currentDesign} />
    </Container>
  );
}

DesignEditView.propTypes = {
  id: PropTypes.string,
};
