import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

export default function DepartmentNewEditForm({ currentCompany }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const DepartmentSchema = Yup.object().shape({
    departmentName: Yup.string().required('Department Name is required'),
    departmentCode: Yup.string().required('Department Code is required'),
    departmentHead: Yup.string().required('Department Head is required'),
    departmentDescription: Yup.string().required('Department Description is required'),
  });

  const defaultValues = useMemo(() => ({
    departmentName: currentCompany?.departmentName || '',
    departmentCode: currentCompany?.departmentCode || '',
    departmentHead: currentCompany?.departmentHead || '',
    departmentDescription: currentCompany?.departmentDescription || '',
  }), [currentCompany]);

  const methods = useForm({
    resolver: yupResolver(DepartmentSchema),
    defaultValues,
  });

  const { reset, handleSubmit, setValue, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar(currentCompany ? 'Update success!' : 'Create success!');
      reset();
      router.push(paths.dashboard.department.list);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setValue('avatarUrl', newFile, { shouldValidate: true });
    },
    [setValue],
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            Add New Department
          </Typography>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              display='grid'
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name='departmentName' label='Department Name' />
              <RHFTextField name='departmentCode' label='Department Code'
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }} />
              <RHFAutocomplete
                name='departmentHead'
                label='Department Head'
                placeholder='Select Department Head'
                options={[]} // Replace with dynamic options: [{ label: 'John Doe', value: '1' }]
                fullWidth
              />
              <RHFTextField name='departmentDescription' label='Department Description' />
            </Box>
            <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
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

DepartmentNewEditForm.propTypes = {
  currentCompany: PropTypes.shape({
    departmentName: PropTypes.string,
    departmentCode: PropTypes.string,
    departmentHead: PropTypes.string,
    departmentDescription: PropTypes.string,
  }),
};
