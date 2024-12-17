import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormProvider, {
  RHFTextField,
  RHFSwitch, RHFAutocomplete,
} from 'src/components/hook-form';
import countrystatecity from '../../_mock/map/csc.json';
import { paths } from '../../routes/paths';
import { useSnackbar } from 'notistack';
import { useRouter } from '../../routes/hooks';
import { useAuthContext } from '../../auth/hooks';
import { ASSETS_API } from '../../config-global';
import axios from 'axios';

const vendorTypes = [
  'Party',
  'Karigar',
  'Manufacturer',
  'Wholesaler',
  'Retailer',
  'Exporter',
  'Importer',
  'Distributor',
  'Designer',
  'Supplier',
  'Jewelry Repair',
  'Custom Jewelry Maker',
  'Gemstone Dealer',
  'Goldsmith',
  'Silversmith',
  'Platinumsmith',
  'Pawnbroker',
  'Auctioneer',
];

export default function VendorNewEditForm({ currentVendor }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user } = useAuthContext();

  const schema = Yup.object().shape({
    vendorName: Yup.string().required('Vendor Name is required'),
    firmName: Yup.string().required('Firm Name is required'),
    contactNo: Yup.string().required('Contact No. is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    vendorType: Yup.string().required('Vendor Type is required'),
  });

  const defaultValues = useMemo(() => ({
    vendorCode: currentVendor?.vendorCode || '',
    vendorName: currentVendor?.vendorName || '',
    firmName: currentVendor?.firmName || '',
    firmDetails: currentVendor?.firmDetails || '',
    contactNo: currentVendor?.contact || '',
    email: currentVendor?.email || '',
    address: currentVendor?.addressDetails?.address || '',
    town: currentVendor?.addressDetails?.town || '',
    country: currentVendor?.addressDetails?.country || '',
    state: currentVendor?.addressDetails?.state || '',
    city: currentVendor?.addressDetails?.city || '',
    vendorPanNo: currentVendor?.panCard || '',
    gstNo: currentVendor?.gstNumber || '',
    vendorType: currentVendor?.type || '',
    balanceAmt: currentVendor?.balanceAmount || '',
    advanceAmt: currentVendor?.advanceAmount || '',
    fineGold: currentVendor?.fineGold || '',
    fineSilver: currentVendor?.fineSilver || '',
    addToCustomer: currentVendor ? currentVendor?.addToCustomer : true,
  }), [currentVendor]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { reset, handleSubmit, watch, formState: { isSubmitting } } = methods;

  const onSubmit = async (data) => {
    const payload = {
      vendorCode: data.vendorCode,
      vendorName: data.vendorName,
      firmName: data.firmName,
      firmDetails: data.firmDetails,
      contact: data.contactNo,
      email: data.email,
      addressDetails: {
        address: data.address,
        town: data.town,
        country: data.country,
        state: data.state,
        city: data.city,
      },
      panCard: data.vendorPanNo,
      gstNumber: data.gstNo,
      type: data.vendorType,
      balanceAmount: parseFloat(data.balanceAmt) || 0,
      advanceAmount: parseFloat(data.advanceAmt) || 0,
      fineGold: parseFloat(data.fineGold) || 0,
      fineSilver: parseFloat(data.fineSilver) || 0,
      addToCustomer: data.addToCustomer,
    };

    const url = currentVendor
      ? `${ASSETS_API}/api/company/${user?.company}/vendor/${currentVendor?._id}`
      : `${ASSETS_API}/api/company/${user?.company}/vendor`;

    const method = currentVendor ? 'put' : 'post';
    const message = currentVendor ? 'Vendor updated successfully!' : 'Vendor created successfully!';

    try {
      await axios[method](url, payload);
      enqueueSnackbar(message, { variant: 'success' });
      router.push(paths.dashboard.vendor.list);
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('Failed to save vendor details.', { variant: 'error' });
    }
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={2}>
        <Typography variant='h6'>
          {currentVendor ? 'Edit Vendor' : 'Add New Vendor'}
        </Typography>
      </Grid>
      <Grid item xs={10}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ p: 3 }}>
            <Typography variant='h5' gutterBottom sx={{ mb: 2 }}>
              Vendor Details
            </Typography>
            <Box
              display='grid'
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name='vendorCode' label='Vendor Code' disabled req={'red'} />
              <RHFTextField name='vendorName' label='Vendor Name' req={'red'} onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='firmName' label='Firm Name' req={'red'} onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='firmDetails' label='Firm Details' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='contactNo' label='Contact No.' req={'red'} onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
                            req={'red'}
                            inputProps={{ maxLength: 10, pattern: '[0-9]*' }} />
              <RHFTextField name='email' label='Email' />
              <RHFTextField name='address' label='Address' req={'red'} onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='town' label='Town' onInput={(e) => {
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
              <RHFTextField name='vendorPanNo' label='Vendor PAN No.' inputProps={{ maxLength: 10 }}
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }} />
              <RHFTextField name='gstNo' label='GST No.' inputProps={{ maxLength: 15 }}
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }} />
            </Box>
          </Card>
          <Card sx={{ p: 3, my: 2 }}>
            <Typography variant='h5' gutterBottom sx={{ mb: 2 }}>
              Additional Details
            </Typography>
            <Box
              display='grid'
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFAutocomplete
                req={'red'}
                name='vendorType'
                label='Vendor Type'
                placeholder='Select branch type'
                options={vendorTypes}
              />
              <RHFTextField name='balanceAmt' label='Balance Amount' onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
                            inputProps={{ pattern: '[0-9]*' }} />
              <RHFTextField name='advanceAmt' label='Advance Amount' onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
                            inputProps={{ pattern: '[0-9]*' }} />
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
              <RHFSwitch name='addToCustomer' label='Add To Customer' />
            </Box>
            <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
              <Button variant='outlined' onClick={() => handleReset()}>
                Reset
              </Button>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                {currentVendor ? 'Update' : 'Create'}
              </LoadingButton>
            </Stack>
          </Card>
        </FormProvider>
      </Grid>
    </Grid>
  );
}

VendorNewEditForm.propTypes = {
  currentVendor: PropTypes.object,
};
