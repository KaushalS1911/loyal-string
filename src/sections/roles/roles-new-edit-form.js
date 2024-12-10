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

export default function RolesNewEditForm({ currentCompany }) {
  const { enqueueSnackbar } = useSnackbar();

  // Validation Schema
  const Schema = Yup.object().shape({
    department: Yup.string().required('Department is required'),
    role: Yup.string().required('Role is required'),
    description: Yup.string().required('Description is required'),
  });

  // Default values for form
  const defaultValues = {
    department: currentCompany?.department || '',
    role: currentCompany?.role || '',
    description: currentCompany?.description || '',
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar(currentCompany ? 'Update success!' : 'Create success!');
      console.info('Form Data:', data);
    } catch (error) {
      console.error('Submission Error:', error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={4}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {currentCompany ? 'Edit Role' : 'Add New Role'}
          </Typography>
        </Grid>

        <Grid xs={8}>
          <Card sx={{ p: 3 }}>
            <Box
              display="grid"
              gap={3}
              gridTemplateColumns={{
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFAutocomplete
                name="department"
                label="Department"
                placeholder="Select Department"
                options={[]} // Replace with actual options
              />
              <RHFAutocomplete
                name="role"
                label="Role"
                placeholder="Select Role"
                options={[]} // Replace with actual options
              />
              <RHFTextField name="description" label="Description" multiline rows={3} />
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={() => reset()}>
                Reset
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
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
  currentCompany: PropTypes.object,
};
