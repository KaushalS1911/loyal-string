import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { fData } from 'src/utils/format-number';
import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function TaxNewEditForm({ currentCompany }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // Schema validation with Yup
  const NewUserSchema = Yup.object().shape({
    taxName: Yup.string().required('Tax Name is required'),
    percentage: Yup.number().required('Percentage is required').min(0).max(100),
    description: Yup.string().optional(),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    taxType: Yup.string().required('Tax Type is required'),
    financialYear: Yup.string().required('Financial Year is required'),
  });

  const defaultValues = useMemo(
    () => ({
      taxName: currentCompany?.taxName || '',
      percentage: currentCompany?.percentage || '',
      description: currentCompany?.description || '',
      country: currentCompany?.country || '',
      state: currentCompany?.state || '',
      taxType: currentCompany?.taxType || '',
      financialYear: currentCompany?.financialYear || '',
    }),
    [currentCompany],
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentCompany ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue],
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Add New Counter
          </Typography>
        </Grid>

        <Grid item xs={12} md={8}>
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
              {/* Country */}
              <RHFAutocomplete
                name='country'
                label='Country'
                options={[]} // Replace with actual country options
                getOptionLabel={(option) => option}
                fullWidth
              />

              {/* State */}
              <RHFAutocomplete
                name='state'
                label='State'
                options={[]} // Replace with actual state options
                getOptionLabel={(option) => option}
                fullWidth
              />

              {/* Tax Name */}
              <RHFTextField name='taxName' label='Tax Name' />

              {/* Tax Type */}
              <RHFAutocomplete
                name='taxType'
                label='Tax Type'
                options={[]} // Replace with actual tax type options
                getOptionLabel={(option) => option}
                fullWidth
              />

              {/* Percentage */}
              <RHFTextField name='percentage' label='Percentage%' type='number'
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            inputProps={{ pattern: '[0-9]*' }} />

              {/* Financial Year */}
              <RHFAutocomplete
                name='financialYear'
                label='Financial Year'
                options={[]} // Replace with actual financial year options
                getOptionLabel={(option) => option}
                fullWidth
              />

              {/* Description */}
              <RHFTextField
                name='description'
                label='Description'
                multiline
                rows={3}
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
        </Grid>
      </Grid>
    </FormProvider>
  );
}

TaxNewEditForm.propTypes = {
  currentCompany: PropTypes.object,
};
