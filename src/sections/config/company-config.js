import * as Yup from 'yup';
import { useCallback, useMemo  } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/hook-form';
import axios from 'axios';
import { ASSETS_API } from '../../config-global';

// ----------------------------------------------------------------------

export default function CompanyConfig({ company, user, setCompany }) {
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    companyName: Yup.string().required('Company Name is required'),
    companyShortName: Yup.string().required('Company Short Name is required'),
    ownerName: Yup.string().required('Owner Name is required'),
    mobileNo: Yup.string()
      .required('Mobile No is required')
      .matches(/^[0-9]{10}$/, 'Mobile No must be 10 digits'),
    email: Yup.string()
      .email('Must be a valid email')
      .required('Email is required'),
  });

  const defaultValues = useMemo(() => ({
    companyName: company?.name || '',
    companyShortName: company?.short_name || '',
    ownerName: company?.owner_name || '',
    registeredAddress: company?.registered_address || '',
    factoryAddress: company?.factory_address || '',
    mobileNo: company?.contact || '',
    email: company?.email || '',
    website: company?.website || '',
    registrationNo: company?.registrationNo || '',
    gstinNo: company?.GST || '',
    panNo: company?.PAN || '',
    aadharNo: company?.AADHAR || '',
    vatNo: company?.VAT || '',
    cgstNo: company?.CGST || '',
    logo_url: company?.logo_url || null,
  }), [company]);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.companyName,
        short_name: data.companyShortName,
        owner_name: data.ownerName,
        registered_address: data.registeredAddress,
        factory_address: data.factoryAddress,
        contact: data.mobileNo,
        email: data.email,
        GST: data.gstinNo,
        PAN: data.panNo,
        AADHAR: data.aadharNo,
        VAT: data.vatNo,
        CGST: data.cgstNo,
        website: data.website,
        registrationNo: data.registrationNo,
      };

      const response = await axios.put(
        `${ASSETS_API}/api/company/${user?.company}`,
        payload,
        { headers: { 'Content-Type': 'application/json' } },
      );

      setCompany(response.data.data);
      enqueueSnackbar('Company details updated successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error updating company details:', error);
      enqueueSnackbar('Failed to update company details.', { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        setValue('logo_url', Object.assign(file, { preview }), { shouldValidate: true });

        const formData = new FormData();
        formData.append('company-logo', file);

        try {
          const response = await axios.put(
            `${ASSETS_API}/api/company/${user?.company}/update-logo`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
          );
          enqueueSnackbar('Logo updated successfully!', { variant: 'success' });
        } catch (error) {
          console.error('Error updating logo:', error);
          enqueueSnackbar('Failed to update the logo.', { variant: 'error' });
          setValue('logo_url', null, { shouldValidate: true });
        }
      }
    },
    [setValue, setCompany, user, enqueueSnackbar],
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
              <RHFTextField name='companyName' label='Company Name' req='red' />
              <RHFTextField
                name='companyShortName'
                label='Company Short Name'
                req='red'
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <RHFTextField
                name='ownerName'
                label='Owner Name'
                req='red'
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <RHFTextField name='registeredAddress' label='Registered Address' />
              <RHFTextField name='factoryAddress' label='Factory Address' />
              <RHFTextField
                name='mobileNo'
                label='Mobile No'
                inputProps={{
                  maxLength: 10,
                }}
                req='red'
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
              />
              <RHFTextField name='email' label='Email' req='red' />
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
              <RHFTextField name='registrationNo' label='Registration No' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField
                name='gstinNo'
                label='GSTIN No'
                inputProps={{ maxLength: 15 }}
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <RHFTextField
                name='panNo'
                label='PAN No'
                inputProps={{ maxLength: 10 }}
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <RHFTextField
                name='aadharNo'
                label='Aadhar No'
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                inputProps={{ maxLength: 12, pattern: '[0-9]*' }}
              />
              <RHFTextField
                name='vatNo'
                label='VAT No'
                inputProps={{ maxLength: 11 }}
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <RHFTextField
                name='cgstNo'
                label='CGST No'
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
                inputProps={{ maxLength: 15 }}
              />
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
