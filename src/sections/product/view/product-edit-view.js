'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ProductNewEditForm from '../product-new-edit-form';
import { useGetProduct } from '../../../api/product';

// ----------------------------------------------------------------------

export default function ProductEditView({ id }) {
  const settings = useSettingsContext();
  const { product } = useGetProduct();
  const currentProduct = product.find((user) => user._id === id);

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
            name: 'Product',
            href: paths.dashboard.product.list,
          },
          { name: currentProduct?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm currentProduct={currentProduct} />
    </Container>
  );
}

ProductEditView.propTypes = {
  id: PropTypes.string,
};
