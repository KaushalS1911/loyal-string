import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useGetDepartment } from '../../api/department';
import { useAuthContext } from '../../auth/hooks';
import { paths } from '../../routes/paths';
import { useRouter } from '../../routes/hooks';
import axios from 'axios';
import { ASSETS_API } from '../../config-global';

export default function RolesNewEditForm({ currentRoles }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user } = useAuthContext();
  const { department } = useGetDepartment();

  const Schema = Yup.object().shape({
    department: Yup.object()
      .nullable()
      .required('Department is required'),
    role: Yup.string().required('Role is required'),
    description: Yup.string(),
  });

  const defaultValues = {
    department: currentRoles
      ? {
        label: currentRoles?.department?.name,
        value: currentRoles?.department?._id,
      }
      : null,
    role: currentRoles?.role || '',
    description: currentRoles?.desc || '',
  };

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const payload = {
        department: data.department.value,
        role: data.role,
        desc: data.description,
      };

      const url = `${ASSETS_API}/api/company/${user?.company}/roles`;

      if (currentRoles) {
        await axios.put(`${url}/${currentRoles._id}`, payload);
        enqueueSnackbar('Role updated successfully!', { variant: 'success' });
      } else {
        await axios.post(url, payload);
        enqueueSnackbar('Role created successfully!', { variant: 'success' });
      }
      reset();
      router.push(paths.dashboard.roles.list);
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('An error occurred while saving the role.', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={4}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            {currentRoles ? 'Edit Role' : 'Add New Role'}
          </Typography>
        </Grid>

        <Grid xs={8}>
          <Card sx={{ p: 3 }}>
            <Box
              display='grid'
              gap={3}
              gridTemplateColumns={{
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFAutocomplete
                name='department'
                label='Department'
                placeholder='Select Department'
                options={department?.map((depart) => ({
                  label: depart?.name,
                  value: depart?._id,
                }))}
                getOptionLabel={(option) => option.label || ''}
                req={'red'}
              />
              <RHFTextField name='role' label='Role' rows={3} req={'red'} onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='description' label='Description' multiline rows={3} />
            </Box>
            <Stack direction='row' justifyContent='flex-end' spacing={2} sx={{ mt: 3 }}>
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

RolesNewEditForm.propTypes = {
  currentRoles: PropTypes.object,
};
