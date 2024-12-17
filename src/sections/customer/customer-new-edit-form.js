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
  RHFAutocomplete, RHFSwitch,
} from 'src/components/hook-form';
import axios from 'axios';
import countrystatecity from '../../_mock/map/csc.json';
import { useAuthContext } from '../../auth/hooks';
import { useRouter } from '../../routes/hooks';
import { useSnackbar } from 'notistack';
import { ASSETS_API } from '../../config-global';
import { paths } from '../../routes/paths';
import Button from '@mui/material/Button';

export default function CustomerNewEditForm({ currentCustomer }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Employee Email is required').email('Invalid email'),
    mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Invalid mobile number').required('Mobile number is required'),
    streetAddress: Yup.string().required('Street Address is required'),
    town: Yup.string().required('Town is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    pincode: Yup.string().matches(/^[0-9]{6}$/, 'Invalid Pincode').required('Pincode is required'),
    perstreet: Yup.string().required('Permanent Street Address is required'),
    pertown: Yup.string().required('Permanent Town is required'),
    percountry: Yup.string().required('Permanent Country is required'),
    perstate: Yup.string().required('Permanent State is required'),
    percity: Yup.string().required('Permanent City is required'),
    perpincode: Yup.string().matches(/^[0-9]{6}$/, 'Invalid Permanent Pincode').required('Permanent Pincode is required'),
  });

  const defaultValues = useMemo(() => ({
    firstName: currentCustomer?.firstName || '',
    lastName: currentCustomer?.lastName || '',
    email: currentCustomer?.email || '',
    mobileNumber: currentCustomer?.contact || '',
    aadharNo: currentCustomer?.aadharNo || '',
    panNo: currentCustomer?.panNo || '',
    gstin: currentCustomer?.gstin || '',
    balanceAmount: currentCustomer?.balanceAmount || '',
    advanceAmount: currentCustomer?.advanceAmount || '',
    discount: currentCustomer?.discount || '',
    fineGold: currentCustomer?.fineGold || '',
    fineSilver: currentCustomer?.fineSilver || '',
    addToVendor: currentCustomer ? currentCustomer?.addToVendor : true,
    streetAddress: currentCustomer?.billingAddress?.streetAddress || '',
    town: currentCustomer?.billingAddress?.town || '',
    country: currentCustomer?.billingAddress?.country || 'India',
    state: currentCustomer?.billingAddress?.state || 'Gujarat',
    city: currentCustomer?.billingAddress?.city || 'Surat',
    pincode: currentCustomer?.billingAddress?.pincode || '',
    perstreet: currentCustomer?.permanentAddress?.streetAddress || '',
    pertown: currentCustomer?.permanentAddress?.town || '',
    percountry: currentCustomer?.permanentAddress?.country || 'India',
    perstate: currentCustomer?.permanentAddress?.state || 'Gujarat',
    percity: currentCustomer?.permanentAddress?.city || 'Surat',
    perpincode: currentCustomer?.permanentAddress?.pincode || '',
  }), [currentCustomer]);

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { reset, handleSubmit, formState: { isSubmitting }, watch } = methods;

  const onSubmit = async (data) => {
    const isEditMode = Boolean(currentCustomer);
    const apiUrl = `${ASSETS_API}/api/company/${user?.company}/customer${isEditMode ? `/${currentCustomer?._id}` : ''}`;

    const payload = {
      customerCode: data.customerCode,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      contact: data.mobileNumber,
      aadharCard: data.aadharNo,
      panCard: data.panNo,
      gstNumber: data.gstin,
      customerSlab: data.customerSlab || '',
      rateOfInterest: data.rateOfInterest || 0,
      creditPeriod: data.creditPeriod || 0,
      balanceAmount: data.balanceAmount,
      advanceAmount: data.advanceAmount,
      discount: data.discount,
      fineGold: data.fineGold,
      fineSilver: data.fineSilver,
      addToVendor: data.addToVendor,
      billingAddress: {
        streetAddress: data.streetAddress,
        town: data.town,
        country: data.country,
        state: data.state,
        city: data.city,
        pincode: data.pincode,
      },
      permanentAddress: {
        streetAddress: data.perstreet,
        town: data.pertown,
        country: data.percountry,
        state: data.perstate,
        city: data.percity,
        pincode: data.perpincode,
      },
    };

    try {
      if (isEditMode) {
        await axios.put(apiUrl, payload);
        enqueueSnackbar('Customer details updated successfully!', { variant: 'success' });
      } else {
        await axios.post(apiUrl, payload);
        enqueueSnackbar('New customer created successfully!', { variant: 'success' });
      }

      router.push(paths.dashboard.customer.list);
      reset();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to submit customer data', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Grid xs={12}>
              <Typography variant='h5' gutterBottom sx={{ mb: 2 }}>
                Customer profile
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
                <RHFTextField name='customerCode' label='Customer Code' req={'red'} disabled />
                <RHFTextField name='firstName' label='First Name' req={'red'} onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }} />
                <RHFTextField name='lastName' label='Last Name' req={'red'} onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }} />
                <RHFTextField name='email' label='Email' req={'red'} />
                <RHFTextField name='mobileNumber' label='Mobile Number' onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                              req={'red'}
                              inputProps={{ maxLength: 10, pattern: '[0-9]*' }} />
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
                <RHFTextField
                  name='gstin'
                  label='GSTIN'
                  inputProps={{ maxLength: 15 }}
                  onInput={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                />
              </Box>
            </Grid>
            <Grid xs={12}>
              <Typography variant='h5' gutterBottom sx={{ my: 2 }}>
                Additional details
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
                <RHFTextField name='balanceAmount' label='Balance Amount' inputProps={{
                  step: 'any',
                  min: '0',
                  pattern: '[0-9]*[.,]?[0-9]*',
                }} />
                <RHFTextField name='advanceAmount' label='Advance Amount' inputProps={{
                  step: 'any',
                  min: '0',
                  pattern: '[0-9]*[.,]?[0-9]*',
                }} />
                <RHFTextField name='discount' label='Discount (Percentage)' inputProps={{
                  step: 'any',
                  min: '0',
                  pattern: '[0-9]*[.,]?[0-9]*',
                }} />
                <RHFTextField name='fineGold' label='Fine Gold' inputProps={{
                  step: 'any',
                  min: '0',
                  pattern: '[0-9]*[.,]?[0-9]*',
                }} />
                <RHFTextField name='fineSilver' label='Fine Silver' inputProps={{
                  step: 'any',
                  min: '0',
                  pattern: '[0-9]*[.,]?[0-9]*',
                }} />
                <RHFSwitch
                  name='addToVendor'
                  label='Add To Vendor'
                  sx={{ m: 0 }}
                />
              </Box>
            </Grid>
            <Grid xs={12}>
              <Typography variant='h5' gutterBottom sx={{ my: 2 }}>
                Billing Address details
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
                <RHFTextField name='streetAddress' label='Street Address' req={'red'} onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }} />
                <RHFTextField name='town' label='Town' req={'red'} onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }} />
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
                <RHFTextField name='pincode' label='Pincode' onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                              req={'red'}
                              inputProps={{ maxLength: 6, pattern: '[0-9]*' }} />
              </Box>
            </Grid>
            <Grid xs={12}>
              <Typography variant='h5' gutterBottom sx={{ my: 2 }}>
                Permanent Address details
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
                <RHFTextField name='perstreet' label='Street Address' req={'red'} onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }} />
                <RHFTextField name='pertown' label='Town' req={'red'} onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }} />
                <RHFAutocomplete
                  name='percountry'
                  req={'red'}
                  label='Country'
                  placeholder='Choose a country'
                  options={countrystatecity.map((country) => country.name)}
                  isOptionEqualToValue={(option, value) => option === value}
                  defaultValue='India'
                />
                <RHFAutocomplete
                  name='perstate'
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
                  name='percity'
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
                <RHFTextField name='perpincode' label='Pincode' onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                              req={'red'}
                              inputProps={{ maxLength: 6, pattern: '[0-9]*' }} />
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

CustomerNewEditForm.propTypes =
  {
    currentCustomer: PropTypes.object,
  }
;
