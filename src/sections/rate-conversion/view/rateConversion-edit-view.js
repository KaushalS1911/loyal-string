'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import RateConversionNewEditForm from '../rateConversion-new-edit-form';

// ----------------------------------------------------------------------

export default function RateConversionEditView({ id }) {
  const settings = useSettingsContext();

  const currentRateConversion = _userList.find((user) => user.id === id);

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
            name: 'RateConversion',
            href: paths.dashboard.rateconversion.list,
          },
          { name: currentRateConversion?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RateConversionNewEditForm currentRateConversion={currentRateConversion} />
    </Container>
  );
}

RateConversionEditView.propTypes = {
  id: PropTypes.string,
};
