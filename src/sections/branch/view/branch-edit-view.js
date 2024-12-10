'use client';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import BranchNewEditForm from '../branch-new-edit-form';
import { useGetBranch } from '../../../api/branch';

// ----------------------------------------------------------------------

export default function BranchEditView({ id }) {
  const settings = useSettingsContext();
  const { branch, mutate } = useGetBranch();
  const currentBranch = branch.find((branch) => branch?._id === id);

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
            name: 'Branch',
            href: paths.dashboard.branch.list,
          },
          { name: currentBranch?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentBranch && <BranchNewEditForm currentBranch={currentBranch} mutate={mutate} />}
    </Container>
  );
}

BranchEditView.propTypes = {
  id: PropTypes.string,
};
