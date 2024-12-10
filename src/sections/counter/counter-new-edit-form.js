import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

export default function CounterNewEditForm() {
  const { enqueueSnackbar } = useSnackbar();

  // Validation schema
  const CounterSchema = Yup.object().shape({
    companyId: Yup.string().required('Company ID is required'),
    branchId: Yup.string().required('Branch ID is required'),
    counterName: Yup.string().required('Counter Name is required'),
    counterNumber: Yup.string().required('Counter Number is required'),
    counterDescription: Yup.string().required('Counter Description is required'),
    financialYear: Yup.string().required('Financial Year is required'),
  });

  // Default form values
  const defaultValues = useMemo(
    () => ({
      companyId: '',
      branchId: '',
      counterName: '',
      counterNumber: '',
      counterDescription: '',
      financialYear: '',
    }),
    [],
  );

  const methods = useForm({
    resolver: yupResolver(CounterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Counter added successfully!', { variant: 'success' });
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to add counter!', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Add New Counter
          </Typography>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              {/* Company ID */}
              <RHFAutocomplete
                name='companyId'
                label='Company ID'
                placeholder='Select Company ID'
                options={[]} // Replace with actual company options
                getOptionLabel={(option) => option}
                fullWidth
              />

              {/* Branch ID */}
              <RHFAutocomplete
                name='branchId'
                label='Branch ID'
                placeholder='Select Branch ID'
                options={[]} // Replace with actual branch options
                getOptionLabel={(option) => option}
                fullWidth
              />

              {/* Counter Name */}
              <RHFTextField name='counterName' label='Counter Name' />

              {/* Counter Number */}
              <RHFTextField name='counterNumber' label='Counter Number'
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            inputProps={{ pattern: '[0-9]*' }} />

              {/* Counter Description */}
              <RHFTextField
                name='counterDescription'
                label='Counter Description'
                multiline
                rows={3}
              />

              {/* Financial Year */}
              <RHFTextField name='financialYear' label='Financial Year'
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            inputProps={{ pattern: '[0-9]*' }} />
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
        </Grid>
      </Grid>
    </FormProvider>
  );
}
