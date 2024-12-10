'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import AddSingleStockNewEditForm from '../addsinglestock-new-edit-form';

// ----------------------------------------------------------------------

export default function AddSingleStockEditView({ id }) {
  const settings = useSettingsContext();

  const currentAddSingleStock = _userList.find((user) => user.id === id);

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
            name: 'AddSingleStock',
            href: paths.dashboard.addsinglestock.list,
          },
          { name: currentAddSingleStock?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AddSingleStockNewEditForm currentAddSingleStock={currentAddSingleStock} />
    </Container>
  );
}

AddSingleStockEditView.propTypes = {
  id: PropTypes.string,
};
