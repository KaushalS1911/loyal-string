import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { ASSETS_API } from '../../config-global';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useAuthContext } from '../../auth/hooks';
import RHFDatePicker from '../../components/hook-form/rhf-.date-picker';
import { Box } from '@mui/material';
import { paths } from '../../routes/paths';
import { useRouter } from '../../routes/hooks';
import { useSnackbar } from '../../components/snackbar';

export default function DevicesNewEditForm({ currentDevices }) {
  const { user } = useAuthContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const NewDeviceSchema = Yup.object().shape({
    deviceType: Yup.string().required('Device Type is required'),
    activationDate: Yup.date().required('Activation Date is required'),
  });

  const defaultValues = useMemo(
    () => ({
      deviceCode: currentDevices?.deviceCode || '',
      deviceType: currentDevices?.deviceType || '',
      activationDate: currentDevices?.activationDate ? new Date(currentDevices?.activationDate) : new Date(),
      deactivationDate: currentDevices?.deactivationDate ? new Date(currentDevices?.deactivationDate) : null,
      deviceSerialNumber: currentDevices?.serialNo || '',
      deviceBuildNumber: currentDevices?.buildNo || '',
      deviceModel: currentDevices?.deviceModel || '',
      mobileNumber: currentDevices?.contact || '',
      deviceStatus: currentDevices?.status || 'Active',
    }),
    [currentDevices],
  );

  const methods = useForm({
    resolver: yupResolver(NewDeviceSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const payload = {
        deviceCode: data.deviceCode,
        deviceType: data.deviceType,
        deactivationDate: data.deactivationDate || null,
        activationDate: data.activationDate || null,
        serialNo: data.deviceSerialNumber,
        buildNo: data.deviceBuildNumber,
        deviceModel: data.deviceModel,
        contact: data.mobileNumber,
        status: data.deviceStatus,
      };

      const url = currentDevices
        ? `${ASSETS_API}/api/company/${user?.company}/device/${currentDevices._id}`
        : `${ASSETS_API}/api/company/${user?.company}/device`;

      const method = currentDevices ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        enqueueSnackbar(`Device ${currentDevices ? 'updated' : 'added'} successfully!`, { variant: 'success' });
        router.push(paths.dashboard.devices.list);
        reset();
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Failed to ${currentDevices ? 'update' : 'add'} device: ${errorData.message}`, { variant: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('Something went wrong. Please try again.', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h6' sx={{ mb: 2 }}>
        Add New Devices
      </Typography>
      <Card sx={{ p: 3 }}>
        <Box
          display='grid'
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
          }}
          rowGap={3}
          columnGap={2}
        >
          <RHFTextField name='deviceCode' label='Device Code' disabled req='red' />
          <RHFTextField name='deviceType' req='red' label='Device Type' onInput={(e) => {
            e.target.value = e.target.value.toUpperCase();
          }} />
          <RHFDatePicker
            req='red'
            name='activationDate'
            control={control}
            label='Device Activation Date'
          />
          <RHFDatePicker
            name='deactivationDate'
            control={control}
            label='Device Deactivation Date'
          />
          <RHFTextField
            name='deviceSerialNumber'
            label='Device Serial No.'
            onInput={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
          />
          <RHFTextField
            name='deviceBuildNumber'
            label='Device Build No.'
            onInput={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
          />
          <RHFTextField
            name='deviceModel'
            label='Device Model'
            onInput={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
          />
          <RHFTextField
            name='mobileNumber'
            label='Mobile No.'
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
            inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
          />
          <RHFAutocomplete
            name='deviceStatus'
            label='Device Status'
            placeholder='Select device status'
            options={[
              'Inactive', 'Active',
            ]}
          />
        </Box>
        <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
          <Button variant='outlined' onClick={() => reset()}>
            Reset
          </Button>
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}

DevicesNewEditForm.propTypes = {
  currentDevices: PropTypes.object,
};
