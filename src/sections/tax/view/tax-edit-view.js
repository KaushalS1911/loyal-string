'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import TaxNewEditForm from '../tax-new-edit-form';
import { useGetTax } from '../../../api/tax';

// ----------------------------------------------------------------------

export default function TaxEditView({ id }) {
  const settings = useSettingsContext();
  const { tax } = useGetTax();
  const currentTax = tax.find((user) => user._id === id);

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

      {tax && currentTax && <TaxNewEditForm currentTax={currentTax} />}
    </Container>
  );
}

TaxEditView.propTypes = {
  id: PropTypes.string,
};
