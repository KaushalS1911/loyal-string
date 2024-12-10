'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import PurityNewEditForm from '../purity-new-edit-form';

// ----------------------------------------------------------------------

export default function PurityEditView({ id }) {
  const settings = useSettingsContext();

  const currentPurity = _userList.find((user) => user.id === id);

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
            name: 'Purity',
            href: paths.dashboard.purity.list,
          },
          { name: currentPurity?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PurityNewEditForm currentPurity={currentPurity} />
    </Container>
  );
}

PurityEditView.propTypes = {
  id: PropTypes.string,
};
