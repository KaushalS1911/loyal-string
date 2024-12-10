'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CounterNewEditForm from '../counter-new-edit-form';
import { useGetCounter } from '../../../api/counter';

// ----------------------------------------------------------------------

export default function CounterEditView({ id }) {
  const settings = useSettingsContext();
  const { counter, mutate } = useGetCounter();
  const currentCounter = counter.find((user) => user._id === id);

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
            name: 'Counter',
            href: paths.dashboard.counter.list,
          },
          { name: currentCounter?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentCounter && <CounterNewEditForm currentCounter={currentCounter} mutate={mutate} />}
    </Container>
  );
}

CounterEditView.propTypes = {
  id: PropTypes.string,
};
