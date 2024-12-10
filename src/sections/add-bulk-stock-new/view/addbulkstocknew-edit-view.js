'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import AddBulkStockNewNewEditForm from '../addbulkstocknew-new-edit-form';

// ----------------------------------------------------------------------

export default function AddBulkStockNewEditView({ id }) {
  const settings = useSettingsContext();

  const currentAddBulkStockNew = _userList.find((user) => user.id === id);

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
            name: 'AddBulkStockNew',
            href: paths.dashboard.addbulkstocknew.list,
          },
          { name: currentAddBulkStockNew?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AddBulkStockNewNewEditForm currentAddBulkStockNew={currentAddBulkStockNew} />
    </Container>
  );
}

AddBulkStockNewEditView.propTypes = {
  id: PropTypes.string,
};
