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
import FormProvider, { RHFAutocomplete, RHFSwitch, RHFTextField } from 'src/components/hook-form';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuthContext } from '../../auth/hooks';
import { useGetCategory } from '../../api/category';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';
import { useGetBranch } from '../../api/branch';
import { useGetProduct } from '../../api/product';
import { useGetSku } from '../../api/sku';
import { useGetBox } from '../../api/box';
import axios from 'axios';
import { ASSETS_API } from '../../config-global';

export default function PacketNewEditForm({ currentPacket }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user } = useAuthContext();
  const { branch } = useGetBranch();
  const { sku } = useGetSku();
  const { category } = useGetCategory();
  const { product } = useGetProduct();
  const { box } = useGetBox();

  const schema = Yup.object().shape({
    branch: Yup.object().required('Branch is required'),
    sku: Yup.object().required('SKU is required'),
    category: Yup.object().required('Category is required'),
    product: Yup.object().required('Product is required'),
    packetName: Yup.string().required('Packet Name is required'),
    emptyWeight: Yup.number().required('Empty Weight is required'),
    description: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      branch: currentPacket?.branch || null,
      sku: currentPacket?.sku || null,
      category: currentPacket?.category || null,
      product: currentPacket?.product || null,
      packetName: currentPacket?.packetName || '',
      emptyWeight: currentPacket?.emptyWeight || null,
      description: currentPacket?.description || '',
      box: currentPacket?.box || null,
    }),
    [currentPacket],
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
      const url = `${ASSETS_API}/api/company/${user?.company}/packet`;
      const method = currentPacket ? 'PUT' : 'POST';

      const payload = {
        branch: data.branch.value,
        category: data.category.value,
        product: data.product.value,
        SKU: data.sku.value,
        name: data.packetName,
        emptyWeight: data.emptyWeight.toString(),
        box: data.box.value || '',
        desc: data.description,
      };

      const response = await axios({
        method,
        url,
        data: payload,
      });

      enqueueSnackbar(currentPacket ? 'Packet updated successfully!' : 'Packet created successfully!', {
        variant: 'success',
      });

      reset();
      router.push(paths.dashboard.packet.list);
    } catch (error) {
      console.error('Submission error:', error);
      enqueueSnackbar('An error occurred while submitting the form.', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            {currentPacket ? 'Edit Packet' : 'Add New Packet'}
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
                name='branch'
                label='Branch'
                options={branch?.map((item) => ({
                  label: item.name,
                  value: item._id,
                })) || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFAutocomplete
                req={'red'}
                name='category'
                label='Category'
                options={category?.map((item) => ({
                  label: item.name,
                  value: item._id,
                })) || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFAutocomplete
                req={'red'}
                name='product'
                label='Product'
                options={product?.map((item) => ({
                  label: item.name,
                  value: item._id,
                })) || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFAutocomplete
                req={'red'}
                name='sku'
                label='SKU'
                options={sku?.map((item) => ({
                  label: item.name,
                  value: item._id,
                })) || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFTextField name='packetName' label='Packet Name' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
                            req={'red'}
              />
              <RHFTextField name='emptyWeight' label='Empty Weight' type='number' inputProps={{
                step: 'any',
                min: '0',
                pattern: '[0-9]*[.,]?[0-9]*',
              }}
                            req={'red'}
              />
              <RHFAutocomplete
                name='box'
                label='Box'
                options={box?.map((item) => ({
                  label: item.name,
                  value: item._id,
                })) || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFTextField name='description' label='Description' multiline rows={2} />
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

PacketNewEditForm.propTypes = {
  currentPacket: PropTypes.object,
};
