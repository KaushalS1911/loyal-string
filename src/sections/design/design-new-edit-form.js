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
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';
import { useAuthContext } from '../../auth/hooks';
import { useGetCategory } from '../../api/category';
import { useGetProduct } from '../../api/product';
import { paths } from '../../routes/paths';
import { useRouter } from '../../routes/hooks';
import Typography from '@mui/material/Typography';
import { ASSETS_API } from '../../config-global';
import Button from '@mui/material/Button';

export default function DesignNewEditForm({ currentDesign }) {
  const { enqueueSnackbar } = useSnackbar();
  const { product } = useGetProduct();
  const { user } = useAuthContext();
  const { category } = useGetCategory();
  const router = useRouter();

  const schema = Yup.object().shape({
    category: Yup.object().required('Category is required'),
    product: Yup.object().required('Product is required'),
    name: Yup.string().required('Design Name is required'),
    label: Yup.string().required('Label is required'),
  });

  const defaultValues = useMemo(
    () => ({
      category: currentDesign ? {
        label: currentDesign?.category?.name,
        value: currentDesign._id,
      } : null,
      product: currentDesign ? {
        label: currentDesign?.product?.name,
        value: currentDesign._id,
      } : null,
      name: currentDesign?.name || '',
      desc: currentDesign?.desc || '',
      label: currentDesign?.label || '',
      slug: currentDesign?.slug || '',
      min_qty: currentDesign?.min_qty || '',
      min_wt: currentDesign?.min_wt || '',
    }),
    [currentDesign],
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
        category: data.category.value,
        product: data.product.value,
        name: data.name,
        desc: data.desc,
        label: data.label,
        slug: data.slug,
        min_qty: data.min_qty,
        min_wt: data.min_wt,
      };

      const apiUrl = currentDesign
        ? `${ASSETS_API}/api/company/${user?.company}/design/${currentDesign._id}`
        : `${ASSETS_API}/api/company/${user?.company}/design`;
      const method = currentDesign ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      enqueueSnackbar(currentDesign ? 'Design updated successfully!' : 'Design created successfully!');
      router.push(paths.dashboard.design.list);
      reset();
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            {currentDesign ? 'Edit Product' : 'Add New Product'}
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
              <RHFAutocomplete
                req={'red'}
                name='product'
                label='Product'
                placeholder='Choose a product'
                options={product?.map((cate) => ({
                  label: cate.name,
                  value: cate._id,
                })) || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFTextField name='name' req={'red'} label='Design Name' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='label' req={'red'} label='Label' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='slug' label='Slug' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='min_qty' label='Minimum Quantity' type='number' onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
                            inputProps={{ pattern: '[0-9]*' }} />
              <RHFTextField name='min_wt' label='Minimum Weight' type='number'
                            inputProps={{
                              step: 'any',
                              min: '0',
                              pattern: '[0-9]*[.,]?[0-9]*',
                            }} />
              <RHFTextField name='desc' label='Description' multiline rows={4} />
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

DesignNewEditForm.propTypes = {
  currentDesign: PropTypes.object,
};
