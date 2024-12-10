import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Card,
  Typography,
  Stack,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';
import countrystatecity from '../../_mock/map/csc.json';
import RHFDatePicker from '../../components/hook-form/rhf-.date-picker';

export default function EmployeeNewEditForm({ currentCompany }) {
  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    empEmail: Yup.string().required('Employee Email is required').email('Invalid email'),
    mobileNumber: Yup.string().required('Mobile Number is required'),
    streetAddress: Yup.string().required('Street Address is required'),
    town: Yup.string().required('Town is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    aadharNo: Yup.string(),
    panNo: Yup.string(),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    joiningDate: Yup.date().required('Joining Date is required'),
    workLocation: Yup.string().required('Work Location is required'),
    company: Yup.string().required('Company is required'),
    branch: Yup.string().required('Branch is required'),
    department: Yup.string().required('Department is required'),
    counter: Yup.string(),
    roles: Yup.string().required('Role is required'),
    reportingTo: Yup.string(),
    userName: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    bankName: Yup.string().required('Bank Name is required'),
    accountName: Yup.string().required('Account Name is required'),
    bankAccountNo: Yup.string().required('Bank Account Number is required'),
    branchName: Yup.string().required('Branch Name is required'),
    ifscCode: Yup.string().required('IFSC Code is required'),
    salary: Yup.number().required('Salary is required'),
  });

  const defaultValues = useMemo(() => ({
    firstName: '',
    lastName: '',
    empEmail: '',
    mobileNumber: '',
    streetAddress: '',
    town: '',
    country: '',
    state: '',
    city: '',
    aadharNo: '',
    panNo: '',
    dateOfBirth: null,
    gender: '',
    joiningDate: null,
    workLocation: '',
    company: '',
    branch: '',
    department: '',
    counter: '',
    roles: '',
    reportingTo: '',
    userName: '',
    password: '',
    bankName: '',
    accountName: '',
    bankAccountNo: '',
    branchName: '',
    ifscCode: '',
    salary: '',
  }), []);

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { reset, handleSubmit, control, formState: { isSubmitting }, watch } = methods;

  const onSubmit = async (data) => {
    console.log('Form Data:', data);
    reset();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* Personal Details */}
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Personal Details
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)', // Three fields per row
              }}
            >
              <RHFTextField name='firstName' label='First Name' />
              <RHFTextField name='lastName' label='Last Name' />
              <RHFTextField name='empEmail' label='Employee Email' />
              <RHFTextField name='mobileNumber' label='Mobile Number' onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
                            inputProps={{ maxLength: 10, pattern: '[0-9]*' }} />
              <RHFTextField name='streetAddress' label='Street Address' />
              <RHFTextField name='town' label='Town' />
              <RHFAutocomplete
                name='country'
                req={'red'}
                label='Country'
                placeholder='Choose a country'
                options={countrystatecity.map((country) => country.name)}
                isOptionEqualToValue={(option, value) => option === value}
                defaultValue='India'
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
                defaultValue='Gujarat'
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFAutocomplete
                name='city'
                label='City'
                req={'red'}
                placeholder='Choose a City'
                options={
                  watch('state')
                    ? countrystatecity
                    .find((country) => country.name === watch('country'))
                    ?.states.find((state) => state.name === watch('state'))
                    ?.cities.map((city) => city.name) || []
                    : []
                }
                defaultValue='Surat'
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFTextField name='aadharNo' label='Aadhar No'
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            inputProps={{ maxLength: 12, pattern: '[0-9]*' }} />
              <RHFTextField name='panNo' label='Pan No'
                            inputProps={{ maxLength: 10 }}
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }} />
              <RHFDatePicker
                name='dateOfBirth'
                control={control}
                label='Date of Birth'
              />
              <RHFTextField name='gender' label='Gender' />
              <RHFDatePicker
                name='joiningDate'
                control={control}
                label='Joining Date'
              />
              <RHFTextField name='workLocation' label='Work Location' />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              System Details
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name='company' label='Company' />
              <RHFTextField name='branch' label='Branch' />
              <RHFTextField name='department' label='Department' />
              <RHFTextField name='counter' label='Counter' />
              <RHFTextField name='roles' label='Roles' />
              <RHFTextField name='reportingTo' label='Reporting To' />
              <RHFTextField name='userName' label='Username' />
              <RHFTextField name='password' label='Password' />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Bank Details
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name='bankName' label='Bank Name' />
              <RHFTextField name='accountName' label='Account Name' />
              <RHFTextField name='bankAccountNo' label='Bank Account No'
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }} />
              <RHFTextField name='branchName' label='Branch Name' />
              <RHFTextField name='ifscCode' label='IFSC Code'
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            inputProps={{ pattern: '[0-9]*' }} />
              <RHFTextField name='salary' label='Salary'
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            inputProps={{ pattern: '[0-9]*' }} />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12}>
          <Stack direction='row' justifyContent='flex-end' spacing={2}>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              Submit
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

EmployeeNewEditForm.propTypes = {
  currentCompany: PropTypes.object,
};
