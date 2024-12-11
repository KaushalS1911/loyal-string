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
import FormProvider, { RHFTextField, RHFAutocomplete, RHFSwitch } from 'src/components/hook-form';
import { useGetBranch } from '../../api/branch';
import { ASSETS_API } from '../../config-global';
import { useAuthContext } from '../../auth/hooks';
import { useRouter } from '../../routes/hooks';
import axios from 'axios';
import { paths } from '../../routes/paths';

export default function CounterNewEditForm({ currentCounter }) {
  const { enqueueSnackbar } = useSnackbar();
  const { branch } = useGetBranch();
  const router = useRouter();
  const { user } = useAuthContext();
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

  const CounterSchema = Yup.object().shape({
    branchId: Yup.mixed().required('Branch ID is required'),
    counterName: Yup.string().required('Counter Name is required'),
    counterNumber: Yup.string().required('Counter Number is required'),
    counterDescription: Yup.string().required('Counter Description is required'),
    financialYear: Yup.string().required('Financial Year is required'),
  });

  const defaultValues = useMemo(
    () => ({
      branchId: currentCounter?.branch
        ? {
          label: currentCounter.branch.name,
          value: currentCounter.branch._id,
        }
        : '',
      counterName: currentCounter?.name || '',
      counterNumber: currentCounter?.counter_number || '',
      counterDescription: currentCounter?.desc || '',
      financialYear: currentCounter?.financial_year || currentFinancialYear,
      status: currentCounter?.status || '',
    }),
    [currentCounter, currentFinancialYear],
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
      const apiUrl = currentCounter
        ? `${ASSETS_API}/api/company/${user?.company}/counter/${currentCounter._id}`
        : `${ASSETS_API}/api/company/${user?.company}/counter`;

      const payload = {
        branch: data.branchId?.value,
        name: data.counterName,
        counter_number: data.counterNumber,
        desc: data.counterDescription,
        financial_year: data.financialYear,
        status: data.status,
      };

      const response = currentCounter
        ? await axios.put(apiUrl, payload)
        : await axios.post(apiUrl, payload);

      if (response.status === 201 || response.status === 200) {
        enqueueSnackbar(
          currentCounter ? 'Counter updated successfully!' : 'Counter added successfully!',
          { variant: 'success' },
        );
        router.push(paths.dashboard.counter.list);
        reset();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        currentCounter ? 'Failed to update counter!' : 'Failed to add counter!',
        { variant: 'error' },
      );
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            {currentCounter ? 'Edit Counter' : 'Add New Counter'}
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
              <RHFAutocomplete
                name='branchId'
                label='Branch ID'
                placeholder='Select Branch ID'
                options={branch?.map((e) => ({
                  label: e.name,
                  value: e._id,
                }))}
                getOptionLabel={(option) => option.label || ''}
                fullWidth
              />
              <RHFTextField name='counterName' label='Counter Name' />
              <RHFTextField
                name='counterNumber'
                label='Counter Number'
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <RHFAutocomplete
                name='financialYear'
                label='Financial Year'
                placeholder='Select Financial Year'
                options={yearOptions}
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFTextField
                name='counterDescription'
                label='Counter Description'
                multiline
                rows={3}
              />
              {currentCounter && <RHFSwitch
                name='status'
                label='Status'
                sx={{ m: 0 }}
              />}
            </Box>
            <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
              <Button variant='outlined' onClick={() => reset()}>
                Reset
              </Button>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                {currentCounter ? 'Update' : 'Submit'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
