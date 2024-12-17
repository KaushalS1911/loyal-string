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
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useRouter } from '../../routes/hooks';
import { useAuthContext } from '../../auth/hooks';
import { useGetBranch } from '../../api/branch';
import { useGetCategory } from '../../api/category';
import { useGetProduct } from '../../api/product';
import { paths } from '../../routes/paths';
import { useGetPacket } from '../../api/packet';
import { ASSETS_API } from '../../config-global';

export default function BoxNewEditForm({ currentBox }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user } = useAuthContext();
  const { branch } = useGetBranch();
  const { category } = useGetCategory();
  const { product } = useGetProduct();
  const { packet } = useGetPacket();

  const schema = Yup.object().shape({
    branch: Yup.string().required('Branch is required'),
    category: Yup.string().required('Category is required'),
    product: Yup.string().required('Product is required'),
    boxName: Yup.string().required('Box Name is required'),
    emptyWeight: Yup.number()
      .typeError('Empty Weight must be a number')
      .positive('Empty Weight must be positive')
      .required('Empty Weight is required'),
    description: Yup.string().required('Description is required'),
    packetMaster: Yup.string().required('Select Packet Master is required'),
  });

  const defaultValues = useMemo(
    () => ({
      branch: currentBox?.branch || '',
      category: currentBox?.category || '',
      product: currentBox?.product || '',
      boxName: currentBox?.boxName || '',
      emptyWeight: currentBox?.emptyWeight || '',
      description: currentBox?.description || '',
      packetMaster: currentBox?.packetMaster || '',
    }),
    [currentBox],
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
      const apiUrl = `${ASSETS_API}/api/company/${user?.company}/box`;
      const payload = {
        branch: data.branch?.value || data.branch,
        category: data.category?.value || data.category,
        product: data.product?.value || data.product,
        name: data.boxName,
        emptyWeight: String(data.emptyWeight),
        desc: data.description,
        packetMaster: data.packetMaster,
      };

      if (currentBox?.id) {
        await axios.put(`${apiUrl}/${currentBox.id}`, payload);
        enqueueSnackbar('Box updated successfully!', { variant: 'success' });
      } else {
        await axios.post(apiUrl, payload);
        enqueueSnackbar('Box created successfully!', { variant: 'success' });
      }

      reset();
      router.push(paths.dashboard.box.list);
    } catch (error) {
      enqueueSnackbar(error.message || 'An error occurred', { variant: 'error' });
      console.error('Submission error:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Typography variant='h6' sx={{ mb: 0.5 }}>
          {currentBox ? 'Edit Box' : 'Add New Box'}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                name='branch'
                label='Branch'
                options={branch?.map((item) => ({
                  label: item.name,
                  value: item._id,
                })) || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFAutocomplete
                name='category'
                label='Category'
                options={category?.map((item) => ({
                  label: item.name,
                  value: item._id,
                })) || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFAutocomplete
                name='product'
                label='Product'
                options={product?.map((item) => ({
                  label: item.name,
                  value: item._id,
                })) || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFAutocomplete
                name='packetMaster'
                label='Select Packet'
                options={packet?.map((item) => ({
                  label: item.name,
                  value: item._id,
                })) || []}
                multiple
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
              />
              <RHFTextField
                name='boxName'
                label='Box Name'
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <RHFTextField
                name='emptyWeight'
                label='Empty Weight'
                type='number'
                inputProps={{
                  step: 'any',
                  min: '0',
                  pattern: '[0-9]*[.,]?[0-9]*',
                }}
              />
              <RHFTextField name='description' label='Description' multiline rows={2} />
            </Box>
            <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
              <Button variant='outlined' onClick={() => reset()}>
                Reset
              </Button>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                {currentBox ? 'Update' : 'Create'}
              </LoadingButton>
            </Stack>
          </Card>
        </FormProvider>
      </Grid>
    </Grid>
  );
}

BoxNewEditForm.propTypes = {
  currentBox: PropTypes.object,
};
