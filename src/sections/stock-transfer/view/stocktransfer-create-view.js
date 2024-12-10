'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import StockTransferNewEditForm from '../stocktransfer-new-edit-form';

// ----------------------------------------------------------------------

export default function StockTransferCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new StockTransfer'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'StockTransfer',
            href: paths.dashboard.stocktransfer.list,
          },
          { name: 'New StockTransfer' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StockTransferNewEditForm />
    </Container>
  );
}
