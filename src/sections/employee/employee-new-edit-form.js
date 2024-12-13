import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Card,
  Typography,
  Stack,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';
import axios from 'axios';
import countrystatecity from '../../_mock/map/csc.json';
import RHFDatePicker from '../../components/hook-form/rhf-.date-picker';
import { useGetBranch } from '../../api/branch';
import { useAuthContext } from '../../auth/hooks';
import { useGetDepartment } from '../../api/department';
import { useGetUsers } from '../../api/users';
import { useGetRoles } from '../../api/roles';
import { useRouter } from '../../routes/hooks';
import { useSnackbar } from 'notistack';
import { ASSETS_API } from '../../config-global';
import { paths } from '../../routes/paths';
import Button from '@mui/material/Button';

export default function EmployeeNewEditForm({ currentEmployee }) {
  const { branch } = useGetBranch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { users } = useGetUsers();
  const { user } = useAuthContext();
  const { department } = useGetDepartment();
  const { roles } = useGetRoles();
  const storedBranch = sessionStorage.getItem('selectedBranch');
  let parsedBranch = storedBranch;

  if (storedBranch !== 'all') {
    try {
      parsedBranch = JSON.parse(storedBranch);
    } catch (error) {
      console.error('Error parsing storedBranch:', error);
    }
  }

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    empEmail: Yup.string().required('Employee Email is required').email('Invalid email'),
    mobileNumber: Yup.string().required('Mobile Number is required'),
    streetAddress: Yup.string().required('Street Address is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    aadharNo: Yup.string(),
    panNo: Yup.string(),
    dateOfBirth: Yup.date().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required'),
    joiningDate: Yup.date().required('Joining Date is required'),
    workLocation: Yup.string().required('Work Location is required'),
    department: Yup.object().required('Department is required'),
    roles: Yup.string().required('Role is required'),
    reportingTo: Yup.object().required('Reporting To is required'),
    userName: Yup.string().required('Username is required'),
    password: currentEmployee ? Yup.string() : Yup.string().required('Password is required'),
  });

  const defaultValues = useMemo(() => ({
    firstName: currentEmployee?.firstName || '',
    lastName: currentEmployee?.lastName || '',
    empEmail: currentEmployee?.email || '',
    mobileNumber: currentEmployee?.contact || '',
    streetAddress: currentEmployee?.addressDetails?.streetAddress || '',
    town: currentEmployee?.addressDetails?.town || '',
    country: currentEmployee?.addressDetails?.country || '',
    state: currentEmployee?.addressDetails?.state || '',
    city: currentEmployee?.addressDetails?.city || '',
    aadharNo: currentEmployee?.aadharCard || '',
    panNo: currentEmployee?.panCard || '',
    dateOfBirth: currentEmployee?.dob ? new Date(currentEmployee.dob) : null,
    gender: currentEmployee?.gender || '',
    joiningDate: currentEmployee?.joiningDate ? new Date(currentEmployee.joiningDate) : new Date(),
    workLocation: currentEmployee?.workLocation || '',
    branch: currentEmployee?.branch
      ? {
        label: currentEmployee.branch.name,
        value: currentEmployee.branch._id,
      }
      : storedBranch !== 'all' ? parsedBranch : null,
    department: currentEmployee?.department
      ? {
        label: currentEmployee.department.name,
        value: currentEmployee.department._id,
      }
      : null,
    roles: currentEmployee?.role || null,
    reportingTo: currentEmployee?.reportingTo
      ? {
        label: `${currentEmployee.reportingTo.firstName} ${currentEmployee.reportingTo.lastName} (${currentEmployee.reportingTo.role})`,
        value: currentEmployee.reportingTo._id,
      }
      : null,
    userName: currentEmployee?.username || '',
    bankName: currentEmployee?.bankDetails?.bankName || '',
    accountName: currentEmployee?.bankDetails?.accountName || '',
    bankAccountNo: currentEmployee?.bankDetails?.bankAccountNo || '',
    branchName: currentEmployee?.bankDetails?.branchName || '',
    ifscCode: currentEmployee?.bankDetails?.ifscCode || '',
    salary: currentEmployee?.salary || '',
  }), [currentEmployee]);

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { reset, handleSubmit, control, formState: { isSubmitting }, watch } = methods;

  const onSubmit = async (data) => {
    const isEditMode = Boolean(currentEmployee);
    const apiUrl = `${ASSETS_API}/api/company/${user?.company}/employee${isEditMode ? `/${currentEmployee?._id}` : ''}`;

    const payload = {
      branch: storedBranch !== 'all' ? parsedBranch : data.branch?.value,
      department: data.department?.value || null,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.empEmail,
      contact: data.mobileNumber,
      addressDetails: {
        streetAddress: data.streetAddress,
        town: data.town,
        country: data.country,
        state: data.state,
        city: data.city,
      },
      panCard: data.panNo,
      aadharCard: data.aadharNo,
      dob: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : null,
      joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString() : new Date(),
      gender: data.gender,
      workLocation: data.workLocation,
      role: data.roles || null,
      reportingTo: data.reportingTo?.value || null,
      username: data.userName,
      password: data.password,
      salary: data.salary,
      bankDetails: {
        bankName: data.bankName,
        accountName: data.accountName,
        bankAccountNo: data.bankAccountNo,
        branchName: data.branchName,
        ifscCode: data.ifscCode,
      },
    };

    try {
      if (isEditMode) {
        await axios.put(apiUrl, payload);
        enqueueSnackbar('Employee details updated successfully!', { variant: 'success' });
      } else {
        await axios.post(apiUrl, payload);
        enqueueSnackbar('New employee created successfully!', { variant: 'success' });
      }

      router.push(paths.dashboard.employee.list);
      reset();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to submit employee data', { variant: 'error' });
    }
  };

  const BranchValue = storedBranch !== 'all' ? parsedBranch : watch('branch')?.value;
  const departmentValue = watch('department')?.value;

  const filteredDepartment = department
    ?.filter((e) => e?.branch?._id === BranchValue)
    .map((department) => ({
      label: department?.name,
      value: department?._id,
    }));

  const filteredRoles = roles
    ?.filter((e) => e?.department?._id === departmentValue)
    .map((role) => (role?.role));

  const filteredEmployees = users
    ?.filter((user) => user.role === 'Admin' || user.branch?._id == BranchValue)
    .map((employee) => ({
      label: `${employee.firstName} ${employee.lastName} (${employee.role})`,
      value: employee._id,
    }));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Grid xs={12}>
              <Typography variant='h5' gutterBottom sx={{ mb: 2 }}>
                Personal Details
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
                <RHFTextField name='firstName' label='First Name' req={'red'} onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }} />
                <RHFTextField name='lastName' label='Last Name' req={'red'} onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }} />
                <RHFTextField name='empEmail' label='Employee Email' req={'red'} />
                <RHFTextField name='mobileNumber' label='Mobile Number' onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                              req={'red'}
                              inputProps={{ maxLength: 10, pattern: '[0-9]*' }} />
                <RHFTextField name='streetAddress' label='Street Address' req={'red'} />
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
                  req={'red'}
                  name='dateOfBirth'
                  control={control}
                  label='Date of Birth'
                />
                <RHFAutocomplete
                  req={'red'}
                  name='gender'
                  label='Gender'
                  placeholder='Select Gender'
                  options={['Male', 'Female', 'Other']}
                  isOptionEqualToValue={(option, value) => option === value}
                />
                <RHFDatePicker
                  req={'red'}
                  name='joiningDate'
                  control={control}
                  label='Joining Date'
                />
                <RHFTextField name='workLocation' label='Work Location' req={'red'} />
              </Box>
            </Grid>
            <Grid xs={12}>
              <Typography variant='h5' gutterBottom sx={{ my: 2 }}>
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
                {storedBranch === 'all' && <RHFAutocomplete
                  req={'red'}
                  name='branch'
                  label='Branch '
                  placeholder='Select Branch ID'
                  options={branch?.map((branch) => ({
                    label: branch.name,
                    value: branch._id,
                  }))}
                  getOptionLabel={(option) => option.label || ''}
                  fullWidth
                />}
                <RHFAutocomplete
                  name='department'
                  label='Department'
                  placeholder={BranchValue ? 'Select Department' : 'Select a Branch First'}
                  options={filteredDepartment}
                  getOptionLabel={(option) => option.label || ''}
                  req={'red'}
                />
                <RHFAutocomplete
                  name='roles'
                  label='Roles'
                  placeholder={departmentValue ? 'Select Roles' : 'Select a Department First'}
                  options={filteredRoles}
                  req='red'
                />
                <RHFAutocomplete
                  name='reportingTo'
                  label='Reporting To'
                  placeholder='Select Reporting To'
                  options={filteredEmployees}
                  getOptionLabel={(option) => option.label || ''}
                  req={'red'}
                />
                <RHFTextField name='userName' label='Username' req={'red'} />
                {!currentEmployee && <RHFTextField name='password' label='Password' req={'red'} />}
                <RHFTextField name='salary' label='Salary'
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                              }}
                              inputProps={{ pattern: '[0-9]*' }} />
              </Box>
            </Grid>
            <Grid xs={12}>
              <Typography variant='h5' gutterBottom sx={{ my: 2 }}>
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
                                e.target.value = e.target.value.toUpperCase();
                              }} />
              </Box>
              <Grid xs={12}>
                <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
                  <Button variant='outlined' onClick={() => reset()}>
                    Reset
                  </Button>
                  <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                    Submit
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

EmployeeNewEditForm.propTypes =
  {
    currentEmployee: PropTypes.object,
  }
;
