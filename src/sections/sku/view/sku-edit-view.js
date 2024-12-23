'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import SkuNewEditForm from '../sku-new-edit-form';
import { useGetSku } from '../../../api/sku';

// ----------------------------------------------------------------------

export default function SkuEditView({ id }) {
  const settings = useSettingsContext();
  const { sku } = useGetSku();
  const currentSku = sku.find((user) => user._id === id);

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
          { name: currentSku?.SKUName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentSku && <SkuNewEditForm currentSku={currentSku} />}
    </Container>
  );
}

SkuEditView.propTypes = {
  id: PropTypes.string,
};
