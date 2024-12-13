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
  const storedBranch = sessionStorage.getItem('selectedBranch');
  let parsedBranch = storedBranch;

  if (storedBranch !== 'all') {
    try {
      parsedBranch = JSON.parse(storedBranch);
    } catch (error) {
      console.error('Error parsing storedBranch:', error);
    }
  }

  const DepartmentSchema = Yup.object().shape({
    departmentName: Yup.string().required('Department Name is required'),
    departmentHead: Yup.object()
      .shape({
        label: Yup.string().required('Head label is required'),
        value: Yup.string().required('Head value is required'),
      })
      .nullable()
      .required('Department Head is required'),
  });

  const defaultValues = useMemo(() => ({
    branchId: currentDepartment?.branch
      ? {
        label: currentDepartment.branch.name,
        value: currentDepartment.branch._id,
      }
      : null,
    departmentHead: currentDepartment
      ? {
        label: currentDepartment?.department_head?.firstName + ' ' + currentDepartment?.department_head?.lastName,
        value: currentDepartment?.branch?._id,
      }
      : null,
    departmentName: currentDepartment?.name || '',
    departmentCode: currentDepartment?.department_code || '',
    departmentDescription: currentDepartment?.desc || '',
  }), [currentDepartment]);

  const methods = useForm({
    resolver: yupResolver(DepartmentSchema),
    defaultValues,
  });

  const { reset, handleSubmit, formState: { isSubmitting }, watch } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {

      const payload = {
        branch: storedBranch !== 'all' ? parsedBranch : data.branchId.value,
        name: data.departmentName,
        department_code: data.departmentCode,
        department_head: data.departmentHead.value,
        desc: data.departmentDescription,
      };

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

  const BranchValue = storedBranch !== 'all' ? parsedBranch : watch('branchId')?.value;
  const filteredEmployees = users
    ?.filter((user) => user.role === 'Admin' || user.branch?._id === BranchValue)
    .map((employee) => ({
      label: `${employee.firstName} ${employee.lastName} (${employee.role})`,
      value: employee._id,
    }));

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
              {storedBranch === 'all' && (
                <RHFAutocomplete
                  name='branchId'
                  label='Branch'
                  placeholder='Select Branch ID'
                  options={branch
                    ?.filter((e) => e.status !== false)
                    .map((e) => ({
                      label: e.name,
                      value: e._id,
                    }))}
                  getOptionLabel={(option) => option.label || ''}
                  fullWidth
                  req='red'
                />
              )}

              <RHFTextField name='departmentName' label='Department Name' req={'red'} />
              <RHFTextField name='departmentCode' label='Department Code'
                            onInput={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                            }}
                            req={'red'}
                            disabled
              />
              <RHFAutocomplete
                name='departmentHead'
                label='Department Head'
                placeholder='Select Department Head'
                options={filteredEmployees}
                getOptionLabel={(option) => option.label || ''}
                req={'red'}
              />
              <RHFTextField name='departmentDescription' label='Department Description' multiline />
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
