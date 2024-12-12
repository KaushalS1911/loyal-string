import * as Yup from 'yup';
import PropTypes from 'prop-types';
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
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import countrystatecity from '../../_mock/map/csc.json';
import { useAuthContext } from '../../auth/hooks';
import axios from 'axios';
import { ASSETS_API } from '../../config-global';

// ----------------------------------------------------------------------

export default function TaxNewEditForm({ currentTax }) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const currentFinancialYear =
    currentMonth >= 3
      ? `${currentYear}-${currentYear + 1}`
      : `${currentYear - 1}-${currentYear}`;

  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = -5; i <= 5; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      years.push(`${startYear}-${endYear}`);
    }
    return years;
  }, [currentYear]);

  const NewUserSchema = Yup.object().shape({
    taxName: Yup.string().required('Tax Name is required'),
    percentage: Yup.string().required('Percentage is required').min(0).max(100),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    taxType: Yup.string().required('Tax Type is required'),
    financialYear: Yup.string().required('Financial Year is required'),
  });

  const defaultValues = useMemo(
    () => ({
      taxName: currentTax?.taxName || '',
      percentage: currentTax?.per || '',
      description: currentTax?.desc || '',
      country: currentTax?.country || '',
      state: currentTax?.state || '',
      taxType: currentTax?.taxType || '',
      financialYear: currentTax?.financialYear || currentFinancialYear,
    }),
    [currentTax],
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const apiUrl = currentTax
        ? `${ASSETS_API}/api/company/${user?.company}/tax/${currentTax._id}`
        : `${ASSETS_API}/api/company/${user?.company}/tax`;

      const taxData = {
        country: data.country,
        state: data.state,
        taxName: data.taxName,
        taxType: data.taxType,
        per: data.percentage,
        financialYear: data.financialYear,
        desc: data.description,
      };

      const method = currentTax ? 'put' : 'post';

      const response = await axios({
        method,
        url: apiUrl,
        data: taxData,
      });

      enqueueSnackbar(currentTax ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.tax.list);
      reset();
      console.info('API Response:', response);
    } catch (error) {
      enqueueSnackbar('Something went wrong, please try again.', { variant: 'error' });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            {currentTax ? 'Edit Tax' : 'Add New Tax'}
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
              <RHFAutocomplete
                name='country'
                req={'red'}
                label='Country'
                placeholder='Choose a country'
                options={countrystatecity.map((country) => country.name)}
                isOptionEqualToValue={(option, value) => option === value}
                defaultValue={currentTax?.country || 'India'}
              />
              <RHFAutocomplete
                name='state'
                req={'red'}
                label='State'
                placeholder='Choose a State'
                options={
                  watch('country')
                    ? countrystatecity
                    .find((country) => country.name === watch('country'))
                    ?.states.map((state) => state.name) || []
                    : []
                }
                defaultValue={currentTax?.state || 'Gujarat'}
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFTextField name='taxName' label='Tax Name' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
                            req={'red'}
              />
              <RHFAutocomplete
                req={'red'}
                name='taxType'
                label='Tax Type'
                options={[
                  'Sales Tax',
                  'Value Added Tax (VAT)',
                  'Income Tax',
                  'Corporate Tax',
                  'Excise Tax',
                  'Property Tax',
                  'Goods and Services Tax (GST)',
                  'Capital Gains Tax',
                  'Inheritance Tax',
                  'Payroll Tax',
                ]}
                getOptionLabel={(option) => option}
                fullWidth
              />
              <RHFTextField
                req={'red'}
                name='percentage'
                label='Percentage%'
                type='number'
                inputProps={{
                  step: 'any',
                  min: '0',
                  pattern: '[0-9]*[.,]?[0-9]*',
                }}
              />
              <RHFAutocomplete
                req={'red'}
                name='financialYear'
                label='Financial Year'
                placeholder='Select Financial Year'
                options={yearOptions}
                defaultValue={currentTax?.financialYear || currentYear}
                isOptionEqualToValue={(option, value) => option === value}
              />
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
  currentTax: PropTypes.object,
};
