'use client';
import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Card, Container, Grid } from '@mui/material';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    username: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login?.(data.username, data.password);
      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  return (
    <>
      {!!errorMsg && (
        <Alert severity='error' sx={{ mb: 3, mx: 'auto', maxWidth: 600 }}>
          {errorMsg}
        </Alert>
      )}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Container maxWidth='sm'>
            <Card elevation={3} sx={{ p: 6, borderRadius: 2 }}>
              <Typography variant='h4' align='center' sx={{ mb: 3, fontWeight: 'bold' }}>
                Sign In to Your Account
              </Typography>
              <Grid container spacing={3}>
                {/* Login Details */}
                <Grid item xs={12}>
                  <Typography variant='h6' fontWeight='bold' my={2}>
                    Login Details
                  </Typography>
                  <Box
                    columnGap={2}
                    rowGap={3}
                    display='grid'
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(1, 1fr)',
                      md: 'repeat(1, 1fr)',
                    }}
                  >
                    <RHFTextField name='username' label='Username Address' />
                    <RHFTextField
                      name='password'
                      label='Password'
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
                  Login
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
                By signing in, I agree to{' '}
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
                <Typography variant='body2'>Don't have an account?</Typography>
                <Link
                  href={paths.auth.jwt.register}
                  component={RouterLink}
                  variant='subtitle2'
                  underline='hover'
                  color='primary.dark'
                >
                  Sign up
                </Link>
              </Stack>
            </Card>
          </Container>
        </Box>
      </FormProvider>
    </>
  );
}
