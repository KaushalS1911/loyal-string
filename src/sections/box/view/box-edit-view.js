'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import BoxNewEditForm from '../box-new-edit-form';
import { useGetBox } from '../../../api/box';

// ----------------------------------------------------------------------

export default function BoxEditView({ id }) {
  const settings = useSettingsContext();
  const { box } = useGetBox();
  const currentBox = box?.find((user) => user._id === id);

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
            name: 'Box',
            href: paths.dashboard.box.list,
          },
          { name: currentBox?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentBox && <BoxNewEditForm currentBox={currentBox} />}
    </Container>
  );
}

BoxEditView.propTypes = {
  id: PropTypes.string,
};
