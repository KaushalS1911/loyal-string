'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CategoryNewEditForm from '../category-new-edit-form';
import { useGetCategory } from '../../../api/category';

// ----------------------------------------------------------------------

export default function CategoryEditView({ id }) {
  const settings = useSettingsContext();
  const { category } = useGetCategory();
  const currentCategory = category.find((user) => user._id === id);

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
            name: 'Category',
            href: paths.dashboard.category.list,
          },
          { name: currentCategory?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentCategory && <CategoryNewEditForm currentCategory={currentCategory} />}
    </Container>
  );
}

CategoryEditView.propTypes = {
  id: PropTypes.string,
};
