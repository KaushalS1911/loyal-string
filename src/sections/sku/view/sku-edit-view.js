'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SkuNewEditForm from '../sku-new-edit-form';

// ----------------------------------------------------------------------

export default function SkuEditView({ id }) {
  const settings = useSettingsContext();

  const currentSku = _userList.find((user) => user.id === id);

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
            name: 'Sku',
            href: paths.dashboard.sku.list,
          },
          { name: currentSku?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <SkuNewEditForm currentSku={currentSku} />
    </Container>
  );
}

SkuEditView.propTypes = {
  id: PropTypes.string,
};
