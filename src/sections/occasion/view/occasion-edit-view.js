'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import OccasionNewEditForm from '../occasion-new-edit-form';

// ----------------------------------------------------------------------

export default function OccasionEditView({ id }) {
  const settings = useSettingsContext();

  const currentOccasion = _userList.find((user) => user.id === id);

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
            name: 'Occasion',
            href: paths.dashboard.occasion.list,
          },
          { name: currentOccasion?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OccasionNewEditForm currentOccasion={currentOccasion} />
    </Container>
  );
}

OccasionEditView.propTypes = {
  id: PropTypes.string,
};
