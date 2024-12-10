'use client';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Card, Container, Grid } from '@mui/material';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import countrystatecity from '../../../_mock/map/csc.json';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    contact: Yup.string().required('Contact number is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    companyName: Yup.string().required('Company name is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    contact: '',
    email: '',
    username: '',
    password: '',
    websiteUrl: '',
    street: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    aadharNo: '',
    panNo: '',
    gstNo: '',
    companyName: '',
    companyContact: '',
    companyAddress: '',
    role: 'Admin',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const address = {
        country: data.country,
        state: data.state,
        city: data.city,
        street: data.street,
        postalCode: data.postalCode,
      };

      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        contact: data.contact,
        email: data.email,
        username: data.username,
        password: data.password,
        aadharNo: data.aadharNo,
        panNo: data.panNo,
        gstNo: data.gstNo,
        companyName: data.companyName,
        companyContact: data.companyContact,
        companyAddress: data.companyAddress,
        websiteUrl: data.websiteUrl,
        role: data.role,
        address,
      };

      const result = await register(payload);
      if (result.success) {
        enqueueSnackbar('Registration successful!', { variant: 'success' });
        router.push(PATH_AFTER_LOGIN);
      } else {
        reset();
        enqueueSnackbar(result.error, { variant: 'error' });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      enqueueSnackbar('An unexpected error occurred. Please try again later.', { variant: 'error' });
    }
  });

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Container maxWidth='lg' sx={{ py: 4 }}>
            <Card elevation={3} sx={{ p: 6, borderRadius: 2 }}>
              <Typography variant='h4' align='center' sx={{ mb: 3, fontWeight: 'bold' }}>
                Create Your Account
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant='h6' fontWeight='bold' my={2}>
                    Personal Details
                  </Typography>
                  <Box
                    columnGap={2}
                    rowGap={3}
                    display='grid'
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(4, 1fr)',
                    }}
                  >
                    <RHFTextField name='firstName' label='First Name' req={'red'} />
                    <RHFTextField name='lastName' label='Last Name' req={'red'} />
                    <RHFTextField
                      name='contact'
                      label='Contact'
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        if (e.target.value.length > 10) {
                          e.target.value = e.target.value.slice(0, 10);
                        }
                      }}
                      req={'red'}
                    />
                    <RHFTextField name='email' label='Email' req={'red'} />
                    <RHFTextField name='username' label='Username' req={'red'} />
                    <RHFTextField
                      name='password'
                      req={'red'}
                      label='Password'
                      placeholder='Enter a strong password'
                      type={password.value ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={password.onToggle} edge='end'>
                              <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Typography variant='h6' fontWeight='bold' mb={2}>
                    Address Details
                  </Typography>
                  <Box
                    columnGap={2}
                    rowGap={3}
                    display='grid'
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(4, 1fr)',
                    }}
                  >
                    <RHFAutocomplete
                      req={'red'}
                      name='PerCountry'
                      label='Country'
                      placeholder='Choose a country'
                      options={countrystatecity.map((country) => country.name)}
                      isOptionEqualToValue={(option, value) => option === value}
                    />
                    <RHFAutocomplete
                      req={'red'}
                      name='PerState'
                      label='State'
                      placeholder='Choose a State'
                      options={
                        watch('PerCountry')
                          ? countrystatecity
                          .find((country) => country.name === watch('PerCountry'))
                          ?.states.map((state) => state.name) || []
                          : []
                      }
                    />
                    <RHFAutocomplete
                      req={'red'}
                      name='PerCity'
                      label='City'
                      placeholder='Choose a City'
                      options={
                        watch('PerState')
                          ? countrystatecity
                          .find((country) => country.name === watch('PerCountry'))
                          ?.states.find((state) => state.name === watch('PerState'))
                          ?.cities.map((city) => city.name) || []
                          : []
                      }
                    />
                    <RHFTextField
                      name='aadharNo'
                      label='Aadhar No'
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                        if (e.target.value.length > 12) {
                          e.target.value = e.target.value.slice(0, 12);
                        }
                      }}
                    />
                    <RHFTextField
                      name='panNo'
                      label='PAN No'
                      inputProps={{
                        maxLength: 10,
                      }}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        setValue('panNo', value);
                      }}
                    />
                    <RHFTextField
                      name='gstNo'
                      label='GST No'
                      inputProps={{
                        maxLength: 15,
                      }}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        setValue('gstNo', value);
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <Typography variant='h6' fontWeight='bold' mb={2}>
                    Company Details
                  </Typography>
                  <Box
                    columnGap={2}
                    rowGap={3}
                    display='grid'
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(4, 1fr)',
                    }}
                  >
                    <RHFTextField name='companyName' label='Company Name' req={'red'} />
                    <RHFTextField name='companyContact' label='Company Contact No.'
                                  req={'red'}
                                  onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    if (e.target.value.length > 10) {
                                      e.target.value = e.target.value.slice(0, 10);
                                    }
                                  }} />
                    <RHFTextField name='companyAddress' label='Company Address' req={'red'} />
                    <RHFTextField name='websiteUrl' label='Website URL' />
                  </Box>
                </Grid>
              </Grid>
              <Stack alignItems={'end'}>
                <LoadingButton
                  size='large'
                  type='submit'
                  variant='contained'
                  loading={isSubmitting}
                  sx={{
                    mt: 3,
                  }}
                >
                  Create Account
                </LoadingButton>
              </Stack>
              <Typography
                sx={{
                  mt: 2.5,
                  textAlign: 'center',
                  typography: 'caption',
                  color: 'text.secondary',
                }}
              >
                By signing up, I agree to{' '}
                <Link underline='always' color='primary'>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link underline='always' color='primary'>
                  Privacy Policy
                </Link>
                .
              </Typography>
              <Stack direction='row' spacing={0.5} justifyContent='center' mt={2}>
                <Typography variant='body2'>Already have an account?</Typography>
                <Link
                  href={paths.auth.jwt.login}
                  component={RouterLink}
                  variant='subtitle2'
                  underline='hover'
                  color='primary.dark'
                >
                  Sign in
                </Link>
              </Stack>
            </Card>
          </Container>
        </Box>
      </FormProvider>
    </>
  );
}
