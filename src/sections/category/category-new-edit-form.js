import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete, RHFSwitch,
} from 'src/components/hook-form';
import Typography from '@mui/material/Typography';
import { useRouter } from '../../routes/hooks';
import { useAuthContext } from '../../auth/hooks';
import { paths } from '../../routes/paths';
import axios from 'axios';
import { ASSETS_API } from '../../config-global';

const parentCategories = ['Metal', 'Non Metal'];

export default function CategoryForm({ currentCategory }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user } = useAuthContext();

  const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    parentCategory: Yup.string().required('Parent Category is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentCategory?.name || '',
      description: currentCategory?.desc || '',
      shortName: currentCategory?.short_name || '',
      parentCategory: currentCategory?.parent_category || null,
      hsnCode: currentCategory?.hsn || '',
      status: currentCategory?.status || '',
    }),
    [currentCategory],
  );

  const methods = useForm({
    resolver: yupResolver(schema),
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
        name: data.name,
        desc: data.description,
        short_name: data.shortName,
        parent_category: data.parentCategory,
        hsn: data.hsnCode,
        status: data.status,
      };

      const isEdit = !!currentCategory;
      const url = `${ASSETS_API}/api/company/${user?.company}/category${
        isEdit ? `/${currentCategory._id}` : ''
      }`;
      const method = isEdit ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: payload,
      });

      enqueueSnackbar(
        isEdit ? 'Category updated successfully!' : 'Category created successfully!',
        { variant: 'success' },
      );

      router.push(paths.dashboard.category.list);
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to submit the form.', {
        variant: 'error',
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            {currentCategory ? 'Edit Category' : 'Add New Category'}
          </Typography>
        </Grid>
        <Grid xs={8}>
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
              <RHFTextField name='name' label='Name' req={'red'} onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='shortName' label='Short Name' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFAutocomplete
                req={'red'}
                name='parentCategory'
                label='Parent Category'
                placeholder='Select Parent Category'
                options={parentCategories}
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFTextField
                name='hsnCode'
                label='HSN Code'
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <RHFTextField name='description' label='Description' multiline
                            rows={3} />
              {currentCategory && (
                <RHFSwitch
                  name='status'
                  label='Status'
                  sx={{ m: 0 }}
                />
              )}
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

CategoryForm.propTypes = {
  currentCategory: PropTypes.object,
};
