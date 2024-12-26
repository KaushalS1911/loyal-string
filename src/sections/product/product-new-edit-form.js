import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { paths } from '../../routes/paths';
import { useRouter } from '../../routes/hooks';
import { useAuthContext } from '../../auth/hooks';
import { useGetCategory } from '../../api/category';
import Typography from '@mui/material/Typography';
import { ASSETS_API } from '../../config-global';
import axios from 'axios';
import Button from '@mui/material/Button';

export default function ProductNewEditForm({ currentProduct }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { category } = useGetCategory();
  const router = useRouter();

  const schema = Yup.object().shape({
    category: Yup.object().required('Category is required'),
    productName: Yup.string().required('Product Name is required'),
    shortName: Yup.string().required('Short Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      category: currentProduct ? {
        label: currentProduct?.category?.name,
        value: currentProduct._id,
      } : null,
      productName: currentProduct?.name || '',
      shortName: currentProduct?.short_name || '',
      description: currentProduct?.desc || '',
      slug: currentProduct?.slug || '',
    }),
    [currentProduct],
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
      const apiUrl = `${ASSETS_API}/api/company/${user?.company}/product`;

      const payload = {
        category: data.category.value,
        name: data.productName,
        desc: data.description,
        short_name: data.shortName,
        slug: data.slug,
      };

      if (currentProduct) {
        await axios.put(`${apiUrl}/${currentProduct._id}`, payload);
        enqueueSnackbar('Product updated successfully!', { variant: 'success' });
      } else {
        await axios.post(apiUrl, payload);
        enqueueSnackbar('Product created successfully!', { variant: 'success' });
      }

      router.push(paths.dashboard.product.list);
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit the form. Please try again.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            {currentProduct ? 'Edit Product' : 'Add New Product'}
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
              <RHFAutocomplete
                req={'red'}
                name='category'
                label='Category'
                placeholder='Choose a category'
                options={category?.filter((e) => e.status === true).map((cate) => ({
                  label: cate.name,
                  value: cate._id,
                })) || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFTextField req={'red'} name='productName' label='Product Name' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='shortName' req={'red'} label='Short Name' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='slug' label='Slug' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='description' label='Description' multiline rows={4} />
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

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
