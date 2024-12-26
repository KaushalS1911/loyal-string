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
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';
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
import { useAuthContext } from '../../auth/hooks';
import { useRouter } from '../../routes/hooks';
import { useGetCategory } from '../../api/category';
import { useGetProduct } from '../../api/product';
import { useGetPurity } from '../../api/purity';
import { useGetSku } from '../../api/sku';
import { useGetDiamondSizeWeightRate } from '../../api/diamond-size-weight-rate';
import { useGetDesign } from '../../api/design';
import { useGetCustomer } from '../../api/customer';
import { ASSETS_API } from '../../config-global';
import axios from 'axios';
import { paths } from '../../routes/paths';

export default function CustomerTouncheNewEditForm({ currentCustomerTounche }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const router = useRouter();
  const { customer } = useGetCustomer();
  const { category } = useGetCategory();
  const { product } = useGetProduct();
  const { purity } = useGetPurity();
  const { sku } = useGetSku();
  const { design } = useGetDesign();
  const { diamondSizeWeightRate } = useGetDiamondSizeWeightRate();

  const schema = Yup.object().shape({
    customer: Yup.object().required('Customer is required'),
    category: Yup.object().required('Category is required'),
    product: Yup.object().required('Product is required'),
    design: Yup.object().required('Design is required'),
    purity: Yup.object().required('Purity is required'),
  });

  const defaultValues = useMemo(
    () => ({
      customer: currentCustomerTounche?.customer ? {
        label: currentCustomerTounche?.customer.firstName + ' ' + currentCustomerTounche?.customer.lastName,
        value: currentCustomerTounche?.customer._id,
      } : null,
      category: currentCustomerTounche?.category ? {
        label: currentCustomerTounche.category.name,
        value: currentCustomerTounche.category._id,
      } : null,
      product: currentCustomerTounche?.product ? {
        label: currentCustomerTounche.product.name,
        value: currentCustomerTounche.product._id,
      } : null,
      design: currentCustomerTounche?.design ? {
        label: currentCustomerTounche.design.name,
        value: currentCustomerTounche.design._id,
      } : null,
      purity: currentCustomerTounche?.purity ? {
        label: currentCustomerTounche.purity.name,
        value: currentCustomerTounche.purity._id,
      } : null,
      stonelesspercent: currentCustomerTounche?.stoneLessPercent || '',
      makingFixedAmt: currentCustomerTounche?.makingFixedAmt || '',
      makingpercentage: currentCustomerTounche?.makingPercentage || '',
      makingPerGram: currentCustomerTounche?.makingPerGram || '',
      makingFixedWastage: currentCustomerTounche?.makingFixedWastage || '',
      selectedSKUs: currentCustomerTounche?.sku?.map(sku => sku._id) || [],
      template: currentCustomerTounche?.template ? {
        label: currentCustomerTounche.template.templateName,
        value: currentCustomerTounche.template._id,
      } : '',
    }),
    [currentCustomerTounche],
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const requestPayload = {
        customer: data.customer?.value,
        category: data.category?.value,
        product: data.product?.value,
        design: data.design?.value,
        purity: data.purity?.value,
        stoneLessPercent: parseFloat(data.stonelesspercent),
        makingFixedAmt: parseFloat(data.makingFixedAmt),
        makingPercentage: parseFloat(data.makingpercentage),
        makingPerGram: parseFloat(data.makingPerGram),
        makingFixedWastage: parseFloat(data.makingFixedWastage),
        template: data.template?.value,
        sku: data.selectedSKUs || [],
      };

      let response;
      const url = `${ASSETS_API}/api/company/${user?.company}/customer-tounche`;
      if (currentCustomerTounche) {
        response = await axios.put(`${url}/${currentCustomerTounche._id}`, requestPayload);
        enqueueSnackbar('Customer Touch updated successfully!');
      } else {
        response = await axios.post(url, requestPayload);
        enqueueSnackbar('Customer Touch created successfully!');
      }
      router.push(paths.dashboard.customertounche.list);
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage =
        error?.response?.data?.message || 'Something went wrong. Please try again.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const categoryValue = watch('category')?.value;
  const productValue = watch('product')?.value;
  const selectedSKUs = watch('selectedSKUs');
  const purityValue = watch('purity')?.value;
  const designValue = watch('design')?.value;

  const filteredProduct = product
    ?.filter((e) => e?.category?._id === categoryValue)
    .map((pro) => ({
      label: pro.name,
      value: pro._id,
    }));

  const filteredDesign = design
    ?.filter((e) => e?.category?._id === categoryValue && e?.product?._id === productValue)
    .map((desig) => ({
      label: desig.name,
      value: desig._id,
    }));

  const filteredPurity = purity
    ?.filter((e) => e?.category?._id === categoryValue)
    .map((puri) => ({
      label: puri.name,
      value: puri._id,
    }));

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

  const filteredSKUs = useMemo(() => {
    return sku?.filter((s) => {
      const isCategoryMatch = !categoryValue || s.category?._id === categoryValue;
      const isProductMatch = !productValue || s.product?._id === productValue;
      const isDesignMatch = !designValue || s.design?._id === designValue;
      const isPurityMatch = !purityValue || s.purity?._id === purityValue;
      return isCategoryMatch && isProductMatch && isPurityMatch && isDesignMatch;
    });
  }, [sku, categoryValue, productValue, purityValue, designValue]);

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
                name='customer'
                label='Select Customer'
                placeholder='Choose a Customer'
                options={customer?.map((item) => ({
                  label: item.firstName + ' ' + item.lastName,
                  value: item._id,
                })) || []}
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
                name='design'
                req={'red'}
                label='Design'
                placeholder='Choose a Design'
                options={filteredDesign || []}
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
              <RHFTextField name='stonelesspercent' label='Stone Less Percent' inputProps={{
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
              <RHFTextField name='makingpercentage' label='Making Percentage' inputProps={{
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

CustomerTouncheNewEditForm.propTypes = {
  currentCustomerTounche: PropTypes.object,
};
