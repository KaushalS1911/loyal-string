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

export default function MakePaymentsNewEditForm({ currentCompany }) {
  const { enqueueSnackbar } = useSnackbar();

  const schema = Yup.object().shape({
    companyName: Yup.string().required('Company Name is required'),
    companyShortName: Yup.string().required('Company Short Name is required'),
    ownerName: Yup.string().required('Owner Name is required'),
    registeredAddress: Yup.string().required('Registered Address is required'),
    factoryAddress: Yup.string(),
    mobileNo: Yup.string().required('Mobile No is required'),
    email: Yup.string()
      .email('Must be a valid email')
      .required('Email is required'),
    registrationNo: Yup.string(),
    yearOfEstablishment: Yup.string(),
    gstinNo: Yup.string(),
    panNo: Yup.string(),
    aadharNo: Yup.string(),
    vatNo: Yup.string(),
    cgstNo: Yup.string(),
    financialYear: Yup.string().required('Financial Year is required'),
    website: Yup.string().url('Must be a valid URL'),
    websiteURL: Yup.string().url('Must be a valid URL'),
    street: Yup.string(),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string(),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    avatarUrl: Yup.mixed().nullable().required('Company Logo is required'),
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
      avatarUrl: currentCompany?.avatarUrl || null,
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
      console.log('Payload:', data);
      enqueueSnackbar('Form submitted successfully!');
      reset();
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'avatarUrl',
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
              name='avatarUrl'
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
              <RHFTextField name='companyName' label='Company Name' />
              <RHFTextField name='companyShortName' label='Company Short Name' />
              <RHFTextField name='ownerName' label='Owner Name' />
              <RHFTextField name='registeredAddress' label='Registered Address' />
              <RHFTextField name='factoryAddress' label='Factory Address' />
              <RHFTextField
                name='mobileNo'
                label='Mobile No'
                inputProps={{
                  maxLength: 10,
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
              />
              <RHFTextField name='email' label='Email' />
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
              <RHFTextField name='gstinNo' label='GSTIN No' />
              <RHFTextField name='panNo' label='PAN No' />
              <RHFTextField name='aadharNo' label='Aadhar No' />
              <RHFTextField name='vatNo' label='VAT No' />
              <RHFTextField name='cgstNo' label='CGST No' />
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
              <RHFTextField name='postalCode' label='Postal Code' />
              <RHFTextField name='websiteurl' label='Website URL' />
            </Box>
          </Card>
        </Grid>

        <Stack direction='row' justifyContent='flex-end' sx={{ mt: 3 }}>
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Submit
          </LoadingButton>
        </Stack>
      </Grid>
    </FormProvider>
  );
}

MakePaymentsNewEditForm.propTypes = {
  currentCompany: PropTypes.object,
};
