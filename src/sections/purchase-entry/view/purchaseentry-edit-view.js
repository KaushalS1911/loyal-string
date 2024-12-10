'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import PurchaseEntryNewEditForm from '../purchaseentry-new-edit-form';

// ----------------------------------------------------------------------

export default function PurchaseEntryEditView({ id }) {
  const settings = useSettingsContext();

  const currentPurchaseEntry = _userList.find((user) => user.id === id);

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
            name: 'PurchaseEntry',
            href: paths.dashboard.purchaseentry.list,
          },
          { name: currentPurchaseEntry?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PurchaseEntryNewEditForm currentPurchaseEntry={currentPurchaseEntry} />
    </Container>
  );
}

PurchaseEntryEditView.propTypes = {
  id: PropTypes.string,
};
