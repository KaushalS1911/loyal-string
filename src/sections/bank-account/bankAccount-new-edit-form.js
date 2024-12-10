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
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

export default function BankAccountNewEditForm({ currentCompany }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // Validation Schema
  const NewUserSchema = Yup.object().shape({
    bankName: Yup.string().required('Bank Name is required'),
    accountName: Yup.string().required('Account Name is required'),
    bankAccountNo: Yup.string()
      .required('Bank Account No is required')
      .matches(/^\d+$/, 'Bank Account No must be a number'),
    branchName: Yup.string().required('Branch Name is required'),
    mobileNumber: Yup.string()
      .required('Mobile Number is required')
      .matches(/^\d{10}$/, 'Mobile Number must be 10 digits'),
    accountType: Yup.string().required('Account Type is required'),
    branchAddress: Yup.string().required('Branch Address is required'),
    IFSC: Yup.string()
      .required('IFSC Code is required')
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code'),
  });

  // Default values
  const defaultValues = useMemo(
    () => ({
      bankName: currentCompany?.bankName || '',
      accountName: currentCompany?.accountName || '',
      bankAccountNo: currentCompany?.bankAccountNo || '',
      branchName: currentCompany?.branchName || '',
      mobileNumber: currentCompany?.mobileNumber || '',
      accountType: currentCompany?.accountType || '',
      branchAddress: currentCompany?.branchAddress || '',
      IFSC: currentCompany?.IFSC || '',
    }),
    [currentCompany],
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentCompany ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.list);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            {currentCompany ? 'Edit Bank Account' : 'Add New Bank Account'}
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
              <RHFTextField name='bankName' label='Bank Name' />
              <RHFTextField name='accountName' label='Account Name' />
              <RHFTextField name='bankAccountNo' label='Bank Account No'
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }}
              />
              <RHFTextField name='branchName' label='Branch Name' />
              <RHFTextField name='mobileNumber' label='Mobile Number'
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            inputProps={{ maxLength: 10, pattern: '[0-9]*' }} />
              <RHFAutocomplete
                name='accountType'
                label='Account Type'
                placeholder='Select Account Type'
                options={[
                  { label: 'Savings', value: 'savings' },
                  { label: 'Current', value: 'current' },
                  { label: 'Salary', value: 'salary' },
                ]}
                getOptionLabel={(option) => option.label}
              />
              <RHFTextField name='branchAddress' label='Branch Address' />
              <RHFTextField name='IFSC' label='IFSC Code'
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

BankAccountNewEditForm.propTypes = {
  currentCompany: PropTypes.object,
};

BankAccountNewEditForm.defaultProps = {
  currentCompany: null,
};
