import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
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
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useGetUsers } from '../../api/users';
import { useAuthContext } from '../../auth/hooks';
import { ASSETS_API } from '../../config-global';
import axios from 'axios';
import { useGetBranch } from '../../api/branch';

export default function DepartmentNewEditForm({ currentDepartment }) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { users } = useGetUsers();
  const { branch } = useGetBranch();
  const { enqueueSnackbar } = useSnackbar();

  const DepartmentSchema = Yup.object().shape({
    branchId: Yup.mixed().required('Branch ID is required'),
    departmentName: Yup.string().required('Department Name is required'),
    departmentHead: Yup.mixed().required('Department Head is required'),
  });

  const defaultValues = useMemo(() => ({
    branchId: currentDepartment?.branch
      ? {
        label: currentDepartment.branch.name,
        value: currentDepartment.branch._id,
      }
      : '',
    departmentHead: currentDepartment
      ? {
        label: currentDepartment?.department_head?.firstName + ' ' + currentDepartment?.department_head?.lastName,
        value: currentDepartment?.branch?._id,
      }
      : '',
    departmentName: currentDepartment?.name || '',
    departmentCode: currentDepartment?.department_code || '',
    departmentDescription: currentDepartment?.desc || '',
  }), [currentDepartment]);

  const methods = useForm({
    resolver: yupResolver(DepartmentSchema),
    defaultValues,
  });

  const { reset, handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        branch: data.branchId.value,
        name: data.departmentName,
        department_code: data.departmentCode,
        department_head: data.departmentHead.value,
        desc: data.departmentDescription,
      };

      console.log(payload);

      const url = currentDepartment
        ? `${ASSETS_API}/api/company/${user?.company}/department/${currentDepartment._id}`
        : `${ASSETS_API}/api/company/${user?.company}/department`;

      const method = currentDepartment ? 'put' : 'post';

      await axios({
        method,
        url,
        data: payload,
      });
      enqueueSnackbar(currentDepartment ? 'Department updated successfully!' : 'Department created successfully!', { variant: 'success' });
      reset();
      router.push(paths.dashboard.department.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
  });

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
              <RHFAutocomplete
                name='branchId'
                label='Branch'
                placeholder='Select Branch ID'
                options={branch?.map((e) => ({
                  label: e.name,
                  value: e._id,
                }))}
                getOptionLabel={(option) => option.label || ''}
                fullWidth
                req={'red'}
              />
              <RHFTextField name='departmentName' label='Department Name' req={'red'} />
              <RHFTextField name='departmentCode' label='Department Code'
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }}
                            req={'red'}
                            disabled
              />
              <RHFAutocomplete
                req={'red'}
                name='departmentHead'
                label='Department Head'
                placeholder='Select Department Head'
                options={users.map((head) => ({
                  label: head.firstName + ' ' + head.lastName,
                  value: head._id,
                }))}
                getOptionLabel={(option) => option.label || ''}
                fullWidth
              />
              <RHFTextField name='departmentDescription' label='Department Description' multiline/>
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
  currentDepartment: PropTypes.shape({
    departmentName: PropTypes.string,
    departmentCode: PropTypes.string,
    departmentHead: PropTypes.string,
    departmentDescription: PropTypes.string,
  }),
};
