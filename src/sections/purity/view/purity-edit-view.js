'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import PurityNewEditForm from '../purity-new-edit-form';
import { useGetPurity } from '../../../api/purity';

// ----------------------------------------------------------------------

export default function PurityEditView({ id }) {
  const settings = useSettingsContext();
  const { purity } = useGetPurity();
  const currentPurity = purity.find((user) => user._id === id);

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
      {currentPurity && <PurityNewEditForm currentPurity={currentPurity} />}
    </Container>
  );
}

PurityEditView.propTypes = {
  id: PropTypes.string,
};
