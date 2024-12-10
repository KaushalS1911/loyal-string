'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import TaxNewEditForm from '../tax-new-edit-form';

// ----------------------------------------------------------------------

export default function TaxEditView({ id }) {
  const settings = useSettingsContext();

  const currentTax = _userList.find((user) => user.id === id);

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
            name: 'Tax',
            href: paths.dashboard.tax.list,
          },
          { name: currentTax?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TaxNewEditForm currentTax={currentTax} />
    </Container>
  );
}

TaxEditView.propTypes = {
  id: PropTypes.string,
};
