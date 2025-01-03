'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import StoneNewEditForm from '../stone-new-edit-form';
import { useGetStone } from '../../../api/stone';

// ----------------------------------------------------------------------

export default function StoneEditView({ id }) {
  const settings = useSettingsContext();
  const { stone } = useGetStone();
  const currentStone = stone.find((user) => user._id === id);

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
            name: 'Stone',
            href: paths.dashboard.stone.list,
          },
          { name: currentStone?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentStone && <StoneNewEditForm currentStone={currentStone} />}
    </Container>
  );
}

StoneEditView.propTypes = {
  id: PropTypes.string,
};
