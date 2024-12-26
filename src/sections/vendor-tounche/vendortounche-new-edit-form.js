import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useGetVendor } from '../../api/vendor';
import { useGetCategory } from '../../api/category';
import { useGetProduct } from '../../api/product';
import { useGetPurity } from '../../api/purity';
import { useSnackbar } from '../../components/snackbar';
import { useAuthContext } from '../../auth/hooks';
import { useRouter } from '../../routes/hooks';
import { useGetDiamondSizeWeightRate } from '../../api/diamond-size-weight-rate';
import { useGetSku } from '../../api/sku';
import {
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { paths } from '../../routes/paths';
import { ASSETS_API } from '../../config-global';
import axios from 'axios';

export default function VendorTouncheNewEditForm({ currentVendorTounche }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const router = useRouter();
  const { vendor } = useGetVendor();
  const { category } = useGetCategory();
  const { product } = useGetProduct();
  const { purity } = useGetPurity();
  const { sku } = useGetSku();
  const { diamondSizeWeightRate } = useGetDiamondSizeWeightRate();

  const schema = Yup.object().shape({
    vendor: Yup.object().required('Vendor is required'),
    category: Yup.object().required('Category is required'),
    product: Yup.object().required('Product is required'),
    purity: Yup.object().required('Purity is required'),
  });

  const defaultValues = useMemo(
    () => ({
      vendor: currentVendorTounche?.vendor ? {
        label: currentVendorTounche.vendor.vendorName,
        value: currentVendorTounche.vendor._id,
      } : null,
      category: currentVendorTounche?.category ? {
        label: currentVendorTounche.category.name,
        value: currentVendorTounche.category._id,
      } : null,
      product: currentVendorTounche?.product ? {
        label: currentVendorTounche.product.name,
        value: currentVendorTounche.product._id,
      } : null,
      purity: currentVendorTounche?.purity ? {
        label: currentVendorTounche.purity.name,
        value: currentVendorTounche.purity._id,
      } : null,
      gramFine: currentVendorTounche?.gramFine || '',
      wastage: currentVendorTounche?.wastage || '',
      makingFixedAmt: currentVendorTounche?.makingFixedAmt || '',
      makingPerGram: currentVendorTounche?.makingPerGram || '',
      makingFixedWastage: currentVendorTounche?.makingFixedWastage || '',
      template: currentVendorTounche?.template ? {
        label: currentVendorTounche.template.templateName,
        value: currentVendorTounche.template._id,
      } : '',
      selectedSKUs: currentVendorTounche?.sku?.map(sku => sku._id) || [],
    }),
    [currentVendorTounche],
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { handleSubmit, reset, formState: { isSubmitting }, watch, setValue } = methods;

  const onSubmit = async (data) => {
    try {
      const updatedPayload = {
        ...data,
        sku: selectedSKUs,
        vendor: data.vendor.value,
        category: data.category.value,
        product: data.product.value,
        purity: data.purity.value,
        template: data.template?.value,
      };

      const apiUrl = `${ASSETS_API}/api/company/${user?.company}/vendor-tounche`;
      const request = currentVendorTounche
        ? axios.put(`${apiUrl}/${currentVendorTounche._id}`, updatedPayload)
        : axios.post(apiUrl, updatedPayload);

      const response = await request;

      const successMessage = currentVendorTounche
        ? 'Vendor Tounche successfully updated!'
        : 'Vendor Tounche successfully created!';

      enqueueSnackbar(successMessage, { variant: 'success' });
      router.push(paths.dashboard.vendortounche.list);
    } catch (error) {
      console.error('Submission error:', error);
      enqueueSnackbar('Error in submission!', { variant: 'error' });
    }
  };

  const selectedSKUs = watch('selectedSKUs');
  const categoryValue = watch('category')?.value;
  const vendorValue = watch('vendor')?.value;
  const productValue = watch('product')?.value;
  const purityValue = watch('purity')?.value;

  const handleSKUSelection = (skuId) => {
    const updatedSKUs = selectedSKUs.includes(skuId)
      ? selectedSKUs.filter((id) => id !== skuId)
      : [...selectedSKUs, skuId];
    setValue('selectedSKUs', updatedSKUs, { shouldValidate: true });
  };

  const handleSelectAll = () => {
    if (selectedSKUs.length === filteredSKUs?.length) {
      setValue('selectedSKUs', [], { shouldValidate: true });
    } else {
      setValue('selectedSKUs', filteredSKUs?.map(s => s._id) || [], { shouldValidate: true });
    }
  };

  const filteredProduct = useMemo(() =>
    product?.filter((e) => e?.category?._id === categoryValue).map((pro) => ({
      label: pro.name,
      value: pro._id,
    })), [product, categoryValue]);

  const filteredPurity = useMemo(() =>
    purity?.filter((e) => e?.category?._id === categoryValue).map((puri) => ({
      label: puri.name,
      value: puri._id,
    })), [purity, categoryValue]);

  const filteredSKUs = useMemo(() => {
    return sku?.filter((s) => {
      const isVendorMatch = !vendorValue || s.vendor?.some(v => v._id === vendorValue);
      const isCategoryMatch = !categoryValue || s.category?._id === categoryValue;
      const isProductMatch = !productValue || s.product?._id === productValue;
      const isPurityMatch = !purityValue || s.purity?._id === purityValue;
      return isVendorMatch && isCategoryMatch && isProductMatch && isPurityMatch;
    });
  }, [sku, vendorValue, categoryValue, productValue, purityValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              display='grid'
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(5, 1fr)' }}
            >
              <RHFAutocomplete
                req={'red'}
                name='vendor'
                label='Select Vendor'
                placeholder='Choose a vendor'
                options={vendor?.map((item) => ({ label: item.vendorName, value: item._id })) || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
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
                name='product'
                req={'red'}
                label='Product'
                placeholder='Choose a product'
                options={filteredProduct || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFAutocomplete
                req={'red'}
                name='purity'
                label='Purity'
                placeholder='Choose a Purity'
                options={filteredPurity || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFAutocomplete name='gramFine' label='Gram/Fine' placeholder='Choose a Gram/Fine'
                               options={['Gram', 'Fine'] || []}
                               isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFTextField name='wastage' label='Wastage' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFTextField name='makingFixedAmt' label='Making Fixed Amt' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFTextField name='makingPerGram' label='Making Per Gram' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFTextField name='makingFixedWastage' label='Making Fixed Wastage' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFAutocomplete
                name='template'
                label='Select Template'
                placeholder='Choose a template'
                options={diamondSizeWeightRate?.map((item) => ({
                  label: item.templateName,
                  value: item._id,
                })) || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
            </Box>
          </Card>
        </Grid>
        <Grid container spacing={3} xs={12}>
          <Grid xs={12}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant='h6' gutterBottom>
                  SKU Selection
                </Typography>
              </Box>
              <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto' }}>
                <Table size='small'>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                          padding: '6px 8px',
                          fontSize: '0.875rem',
                        }}
                      >
                        <Checkbox
                          checked={selectedSKUs.length === filteredSKUs?.length}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      {['Sr. No', 'SKU', 'Category', 'Product', 'Purity', 'Pieces', 'Sketch Number', 'Weight Categories'].map((label) => (
                        <TableCell key={label} sx={{ fontWeight: 'bold', fontSize: '0.875rem', padding: '4px 8px' }}>
                          {label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSKUs?.map((sku, index) => (
                      <TableRow key={sku._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                        <TableCell sx={{ padding: '4px 8px', fontSize: '0.875rem' }}>
                          <Checkbox
                            checked={selectedSKUs.includes(sku._id)}
                            onChange={() => handleSKUSelection(sku._id)}
                          />
                        </TableCell>
                        {[
                          index + 1,
                          sku?.SKUName || '-',
                          sku?.category?.name || '-',
                          sku?.product?.name || '-',
                          sku?.purity?.name || '-',
                          sku?.pieces || '-',
                          sku?.sketchNumber || '-',
                          sku?.weightCategory?.join(', ') || '-',
                        ].map((value, i) => (
                          <TableCell key={i} sx={{ padding: '4px 8px', fontSize: '0.875rem' }}>
                            {value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
          <Grid xs={12}>
            <Stack direction='row' justifyContent='flex-end' spacing={2} sx={{ mt: 3 }}>
              <Button variant='outlined' onClick={() => reset()}>
                Reset
              </Button>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                Submit
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

VendorTouncheNewEditForm.propTypes = {
  currentVendorTounche: PropTypes.object,
};
