import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { fData } from 'src/utils/format-number';
import Label from 'src/components/label';
import { countries } from 'src/assets/data';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function RateConversionNewEditForm({ currentCompany }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    currencyName: Yup.object().required('Currency Name is required'),
    currency: Yup.string().required('Currency is required'),
    multiplier: Yup.number().required('Multiplier is required').positive('Multiplier must be positive'),
  });

  const defaultValues = useMemo(() => ({
    currencyName: currentCompany?.currencyName || '',
    currency: currentCompany?.currency || '',
    multiplier: currentCompany?.multiplier || '',
  }), [currentCompany]);

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
      enqueueSnackbar('Something went wrong, please try again!', { variant: 'error' });
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

  const currencyOptions = useMemo(() => {
    // Replace with your actual logic to fetch or generate currency options
    return ['USD', 'EUR', 'INR', 'GBP'].map(currency => ({ label: currency, value: currency }));
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Add New Rate Conversion
          </Typography>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFAutocomplete
                name="currencyName"
                label="Currency Name"
                placeholder="Select Currency Name"
                options={currencyOptions}
                getOptionLabel={(option) => option.label}
                fullWidth
              />
              <RHFTextField name="currency" label="Currency" />
              <RHFTextField name="multiplier" label="Multiplier (compared to $)" type="number" />
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={() => reset()}>
                Reset
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Submit
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

RateConversionNewEditForm.propTypes = {
  currentCompany: PropTypes.shape({
    currencyName: PropTypes.string,
    currency: PropTypes.string,
    multiplier: PropTypes.number,
  }),
};
