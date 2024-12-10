import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form'; // Fixed Import
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers'; // MUI DatePicker Import
import FormProvider, { RHFTextField } from 'src/components/hook-form';

export default function DevicesNewEditForm({ currentCompany }) {
  const NewDeviceSchema = Yup.object().shape({
    deviceCode: Yup.string().required('Device Code is required'),
    deviceType: Yup.string().required('Device Type is required'),
    activationDate: Yup.date().required('Activation Date is required'),
    deactivationDate: Yup.date().nullable(),
    deviceSerialNumber: Yup.string().required('Device Serial Number is required'),
    deviceBuildNumber: Yup.string().required('Device Build Number is required'),
    deviceModel: Yup.string().required('Device Model is required'),
    mobileNumber: Yup.string().required('Mobile Number is required'),
    deviceStatus: Yup.string().required('Device Status is required'),
  });

  const defaultValues = useMemo(
    () => ({
      deviceCode: '',
      deviceType: '',
      activationDate: null,
      deactivationDate: null,
      deviceSerialNumber: '',
      deviceBuildNumber: '',
      deviceModel: '',
      mobileNumber: '',
      deviceStatus: '',
    }),
    [],
  );

  const methods = useForm({
    resolver: yupResolver(NewDeviceSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.info('Submitted Data:', data);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h6' sx={{ mb: 2 }}>
        Add New Devices
      </Typography>

      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={4}>
            <RHFTextField name='deviceCode' label='Device Code' />
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <RHFTextField name='deviceType' label='Device Type' />
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <Controller
              name='activationDate'
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label='Device Activation Date'
                  onChange={(date) => setValue('activationDate', date)}
                  renderInput={(params) => <RHFTextField {...params} />}
                />
              )}
            />
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <Controller
              name='deactivationDate'
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label='Device Deactivation Date'
                  onChange={(date) => setValue('deactivationDate', date)}
                  renderInput={(params) => <RHFTextField {...params} />}
                />
              )}
            />
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <RHFTextField name='deviceSerialNumber' label='Device Serial No.'
                          onInput={(e) => {
                            e.target.value = e.target.value.toUpperCase();
                          }}
            />
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <RHFTextField name='deviceBuildNumber' label='Device Build No.'
                          onInput={(e) => {
                            e.target.value = e.target.value.toUpperCase();
                          }}
            />
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <RHFTextField name='deviceModel' label='Device Model'
                          onInput={(e) => {
                            e.target.value = e.target.value.toUpperCase();
                          }} />
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <RHFTextField name='mobileNumber' label='Mobile No.'
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                          }}
                          inputProps={{ maxLength: 10, pattern: '[0-9]*' }} />
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <RHFTextField name='deviceStatus' label='Device Status' />
          </Grid>
        </Grid>

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
  currentCompany: PropTypes.object,
};
