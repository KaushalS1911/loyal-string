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
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from '../../auth/hooks';
import { ASSETS_API } from '../../config-global';
import axios from 'axios';

export default function BankAccountNewEditForm({ currentBankAccount }) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

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
    accountType: Yup.object().required('Account Type is required'),
    branchAddress: Yup.string().required('Branch Address is required'),
    IFSC: Yup.string()
      .required('IFSC Code is required')
    ,
  });

  const defaultValues = useMemo(
    () => ({
      bankName: currentBankAccount?.bankName || '',
      accountName: currentBankAccount?.accountName || '',
      bankAccountNo: currentBankAccount?.bankAccountNo || '',
      branchName: currentBankAccount?.branchName || '',
      mobileNumber: currentBankAccount?.mobileNumber || '',
      accountType: currentBankAccount?.accountType || null,
      branchAddress: currentBankAccount?.branchAddress || '',
      IFSC: currentBankAccount?.IFSC || '',
    }),
    [currentBankAccount],
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
      const payload = {
        bankName: data.bankName,
        accountName: data.accountName,
        accountNo: data.bankAccountNo,
        branchName: data.branchName,
        contact: data.mobileNumber,
        accountType: data.accountType.value,
        branchAddress: data.branchAddress,
        IFSCCode: data.IFSC,
      };

      const apiUrl = `${ASSETS_API}/api/company/${user?.company}/bank-account`;
      const method = currentBankAccount ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url: currentBankAccount ? `${apiUrl}/${currentBankAccount.id}` : apiUrl,
        data: payload,
      });

      enqueueSnackbar(currentBankAccount ? 'Update success!' : 'Create success!');
      reset();
      router.push(paths.dashboard.bankaccount.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            {currentBankAccount ? 'Edit Bank Account' : 'Add New Bank Account'}
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
              <RHFTextField req={'red'} name='bankName' label='Bank Name' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField req={'red'} name='accountName' label='Account Name' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField req={'red'} name='bankAccountNo' label='Bank Account No'
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }}
              />
              <RHFTextField req={'red'} name='branchName' label='Branch Name' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField req={'red'} name='mobileNumber' label='Mobile Number'
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            inputProps={{ maxLength: 10, pattern: '[0-9]*' }} />
              <RHFAutocomplete
                req={'red'}
                name='accountType'
                label='Account Type'
                placeholder='Select Account Type'
                options={[
                  { label: 'Savings', value: 'savings' },
                  { label: 'Current', value: 'current' },
                  { label: 'Salary', value: 'salary' },
                  { label: 'Fixed Deposit', value: 'fd' },
                  { label: 'Recurring Deposit', value: 'rd' },
                  { label: 'Business', value: 'business' },
                  { label: 'Joint', value: 'joint' },
                  { label: 'NRI', value: 'nri' },
                  { label: 'Student', value: 'student' },
                  { label: 'Basic', value: 'basic' },
                ]}
                getOptionLabel={(option) => option.label}
              />
              <RHFTextField req={'red'} name='branchAddress' label='Branch Address' />
              <RHFTextField req={'red'} name='IFSC' label='IFSC Code'
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }} />
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
  currentBankAccount: PropTypes.object,
};

BankAccountNewEditForm.defaultProps = {
  currentBankAccount: null,
};
