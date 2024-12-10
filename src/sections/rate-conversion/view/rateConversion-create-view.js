'use client';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import RateConversionNewEditForm from '../rateConversion-new-edit-form';
import { RateConversionEditView } from './index';

// ----------------------------------------------------------------------

export default function RateConversionCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading='Create a new RateConversion'
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'RateConversion',
            href: paths.dashboard.rateconversion.list,
          },
          { name: 'New RateConversion' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RateConversionNewEditForm />
    </Container>
  );
}
