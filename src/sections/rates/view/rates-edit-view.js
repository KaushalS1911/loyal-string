'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import RatesNewEditForm from '../rates-new-edit-form';

// ----------------------------------------------------------------------

export default function RatesEditView({ id }) {
  const settings = useSettingsContext();

  const currentRates = _userList.find((user) => user.id === id);

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
            name: 'Rates',
            href: paths.dashboard.rates.list,
          },
          { name: currentRates?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RatesNewEditForm currentRates={currentRates} />
    </Container>
  );
}

RatesEditView.propTypes = {
  id: PropTypes.string,
};
