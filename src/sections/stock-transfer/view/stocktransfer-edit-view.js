'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import StockTransferNewEditForm from '../stocktransfer-new-edit-form';

// ----------------------------------------------------------------------

export default function StockTransferEditView({ id }) {
  const settings = useSettingsContext();

  const currentStockTransfer = _userList.find((user) => user.id === id);

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
            name: 'StockTransfer',
            href: paths.dashboard.stocktransfer.list,
          },
          { name: currentStockTransfer?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StockTransferNewEditForm currentStockTransfer={currentStockTransfer} />
    </Container>
  );
}

StockTransferEditView.propTypes = {
  id: PropTypes.string,
};
