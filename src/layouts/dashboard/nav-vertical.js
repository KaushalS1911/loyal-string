import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { usePathname, useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import { NavSectionVertical } from 'src/components/nav-section';
import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import NavToggleButton from '../common/nav-toggle-button';
import { paths } from '../../routes/paths';
import { useGetBranch } from '../../api/branch';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../auth/hooks';
import FormProvider, { RHFAutocomplete } from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function NavVertical({ openNav, onCloseNav }) {
  const { user } = useAuthContext();
  const router = useRouter();
  const { branch } = useGetBranch();
  const pathname = usePathname() || '';
  const lgUp = useResponsive('up', 'lg');
  const navData = useNavData();
  const [selectedBranch, setSelectedBranch] = useState(null);

  const storedBranch = sessionStorage.getItem('selectedBranch');
  const methods = useForm({
    defaultValues: {
      branchId: storedBranch
        ? storedBranch === 'all'
          ? { label: 'All', value: 'all' }
          : { label: 'Loading...', value: storedBranch }
        : { label: 'All', value: 'all' },
    },
  });
  const { setValue } = methods;

  useEffect(() => {
    const currentBranch = selectedBranch?.value;
    const storedBranch = sessionStorage.getItem('selectedBranch');

    if (!currentBranch) {
      setSelectedBranch({ label: 'All', value: 'all' });
      setValue('branchId', { label: 'All', value: 'all' });
    }

    if (user?.role === 'Admin' && !user?.branch && currentBranch !== storedBranch) {
      if (currentBranch) {
        sessionStorage.setItem('selectedBranch', currentBranch);
        router.push(paths.dashboard.root);
      } else {
        sessionStorage.removeItem('selectedBranch');
        setValue('branchId', { label: 'All', value: 'all' });
      }
    } else if (user?.branch && currentBranch !== user?.branch?._id) {
      sessionStorage.setItem('selectedBranch', user?.branch?._id);
      if (selectedBranch?.value !== user?.branch?._id) {
        setValue('branchId', { label: user?.branch?.name, value: user?.branch?._id });
      }
    }
  }, [selectedBranch, user, setValue, router]);

  useEffect(() => {
    if (branch && storedBranch) {
      if (storedBranch === 'all') {
        setValue('branchId', { label: 'All', value: 'all' });
      } else {
        const foundBranch = branch?.find((branchItem) => branchItem?._id === storedBranch);
        if (foundBranch) {
          setValue('branchId', { label: foundBranch.name, value: foundBranch._id });
        } else {

          setValue('branchId', { label: 'All', value: 'all' });
        }
      }
    }
  }, [branch, setValue, storedBranch]);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4, mb: 1 }} />
      {user?.role === 'Admin' && branch && (
        <FormProvider methods={methods}>
          <Box sx={{ mt: 2, mx: 4 }}>
            <RHFAutocomplete
              name='branchId'
              label='Branch'
              placeholder='Choose a Branch'
              options={[
                { label: 'All', value: 'all' },
                ...branch?.map((branchItem) => ({
                  label: branchItem?.name,
                  value: branchItem?._id,
                })),
              ]}
              onChange={(e, value) => {
                setValue('branchId', value);
                setSelectedBranch(value);
              }}
              isOptionEqualToValue={(option, value) => option?.value === value?.value}
            />
          </Box>
        </FormProvider>
      )}
      <NavSectionVertical
        data={navData}
        slotProps={{
          currentRole: user?.role,
        }}
      />
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />
      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
