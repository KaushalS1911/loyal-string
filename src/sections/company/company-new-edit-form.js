import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';
import countrystatecity from '../../_mock/map/csc.json';
import axios from 'axios';
import { ASSETS_API } from '../../config-global';
import { paths } from '../../routes/paths';
import { useRouter } from '../../routes/hooks';

export default function CompanyNewEditForm({ currentCompany }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const schema = Yup.object().shape({
    companyName: Yup.string().required('Company Name is required'),
    companyShortName: Yup.string().required('Company Short Name is required'),
    ownerName: Yup.string().required('Owner Name is required'),
    mobileNo: Yup.string().required('Mobile No is required'),
    email: Yup.string()
      .email('Must be a valid email')
      .required('Email is required'),
  });

  const defaultValues = useMemo(
    () => ({
      companyName: currentCompany?.companyName || '',
      companyShortName: currentCompany?.companyShortName || '',
      ownerName: currentCompany?.ownerName || '',
      registeredAddress: currentCompany?.registeredAddress || '',
      factoryAddress: currentCompany?.factoryAddress || '',
      mobileNo: currentCompany?.mobileNo || '',
      email: currentCompany?.email || '',
      registrationNo: currentCompany?.registrationNo || '',
      yearOfEstablishment: currentCompany?.yearOfEstablishment || '',
      gstinNo: currentCompany?.gstinNo || '',
      panNo: currentCompany?.panNo || '',
      aadharNo: currentCompany?.aadharNo || '',
      vatNo: currentCompany?.vatNo || '',
      cgstNo: currentCompany?.cgstNo || '',
      financialYear: currentCompany?.financialYear || '',
      website: currentCompany?.website || '',
      websiteURL: currentCompany?.websiteURL || '',
      street: currentCompany?.street || '',
      city: currentCompany?.city || '',
      postalCode: currentCompany?.postalCode || '',
      state: currentCompany?.state || '',
      country: currentCompany?.country || '',
      logo_url: currentCompany?.logo_url || null,
    }),
    [currentCompany],
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.companyName,
        short_name: data.companyShortName,
        owner_name: data.ownerName,
        registered_address: data.registeredAddress,
        factory_address: data.factoryAddress,
        email: data.email || null,
        contact: data.mobileNo || null,
        year_of_establishment: data.yearOfEstablishment,
        website: data.website,
        GST: data.gstinNo,
        PAN: data.panNo,
        AADHAR: data.aadharNo,
        VAT: data.vatNo,
        CGST: data.cgstNo,
        logo_url: data.logo_url?.preview || null,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country,
          postal_code: data.postalCode,
        },
        financial_year: data.financialYear,
      };

      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (key === 'logo_url' && data.logo_url) {
          formData.append(key, data.logo_url);
        } else if (typeof payload[key] === 'object' && key === 'address') {
          formData.append(key, JSON.stringify(payload[key]));
        } else {
          formData.append(key, payload[key]);
        }
      });

      const response = await axios.post(`${ASSETS_API}/api/company`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      enqueueSnackbar('Form submitted successfully!', { variant: 'success' });
      router.push(paths.dashboard.company.list);
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      enqueueSnackbar('Failed to submit the form. Please try again.', { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'logo_url',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
          { shouldValidate: true },
        );
      }
    },
    [setValue],
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <RHFUploadAvatar
              name='logo_url'
              onDrop={handleDrop}
            />
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              display='grid'
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name='companyName' label='Company Name' req={'red'} />
              <RHFTextField name='companyShortName' label='Company Short Name' req={'red'} onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='ownerName' label='Owner Name' req={'red'} onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='registeredAddress' label='Registered Address' />
              <RHFTextField name='factoryAddress' label='Factory Address' />
              <RHFTextField
                name='mobileNo'
                label='Mobile No'
                inputProps={{
                  maxLength: 10,
                }}
                req={'red'}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
              />
              <RHFTextField name='email' label='Email' req={'red'} />
              <RHFTextField name='website' label='Website' />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              display='grid'
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(4, 1fr)',
              }}
            >
              <RHFTextField name='registrationNo' label='Registration No' />
              <RHFTextField name='gstinNo' label='GSTIN No'
                            inputProps={{ maxLength: 15 }}
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }} />
              <RHFTextField name='panNo' label='PAN No'
                            inputProps={{ maxLength: 10 }}
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }} />
              <RHFTextField name='aadharNo' label='Aadhar No'
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }}
                            inputProps={{ maxLength: 12, pattern: '[0-9]*' }} />
              <RHFTextField name='vatNo' label='VAT No'
                            inputProps={{ maxLength: 11 }}
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }} />
              <RHFTextField name='cgstNo' label='CGST No'
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }}
                            inputProps={{ maxLength: 15 }} />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              display='grid'
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(4, 1fr)',
              }}
            >
              <RHFTextField name='street' label='Street' />
              <RHFAutocomplete
                name='country'
                label='Country'
                placeholder='Choose a country'
                options={countrystatecity.map((country) => country.name)}
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFAutocomplete
                name='state'
                label='State'
                placeholder='Choose a State'
                options={
                  watch('country')
                    ? countrystatecity
                    .find((country) => country.name === watch('country'))
                    ?.states.map((state) => state.name) || []
                    : []
                }
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFAutocomplete
                name='city'
                label='City'
                placeholder='Choose a City'
                options={
                  watch('state')
                    ? countrystatecity
                    .find((country) => country.name === watch('country'))
                    ?.states.find((state) => state.name === watch('state'))
                    ?.cities.map((city) => city.name) || []
                    : []
                }
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFTextField name='postalCode' label='Postal Code'
                            inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            }} />
              <RHFTextField name='websiteURL' label='Website URL' />
            </Box>
          </Card>
        </Grid>
        <Grid xs={12}>
          <Stack
            direction='row'
            spacing={2}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              Submit
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

CompanyNewEditForm.propTypes = {
  currentCompany: PropTypes.object,
};
