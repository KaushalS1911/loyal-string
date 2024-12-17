'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DesignNewEditForm from '../design-new-edit-form';
import { useGetDesign } from '../../../api/design';

// ----------------------------------------------------------------------

export default function DesignEditView({ id }) {
  const settings = useSettingsContext();
  const { design } = useGetDesign();
  const currentDesign = design.find((user) => user._id === id);

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
      {currentDesign && <DesignNewEditForm currentDesign={currentDesign} />}
    </Container>
  );
}

DesignEditView.propTypes = {
  id: PropTypes.string,
};
