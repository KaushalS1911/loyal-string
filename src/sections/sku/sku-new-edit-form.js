import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Chip, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { MultiFilePreview, UploadBox } from '../../components/upload';
import { useGetVendor } from '../../api/vendor';
import { useGetCategory } from '../../api/category';
import { useGetProduct } from '../../api/product';
import { useGetDesign } from '../../api/design';
import { useGetPurity } from '../../api/purity';
import Iconify from '../../components/iconify';
import { useGetStone } from '../../api/stone';
import { useGetDiamondAttributes } from '../../api/diamond-attributes';
import { useSnackbar } from '../../components/snackbar';
import { useAuthContext } from '../../auth/hooks';
import { useRouter } from '../../routes/hooks';
import axios from 'axios';
import { paths } from '../../routes/paths';
import { ASSETS_API } from '../../config-global';
import { useGetDiamondSizeWeightRate } from '../../api/diamond-size-weight-rate';

export default function SkuNewEditForm({ currentSku }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const router = useRouter();
  const { vendor } = useGetVendor();
  const { category } = useGetCategory();
  const { product } = useGetProduct();
  const { design } = useGetDesign();
  const { purity } = useGetPurity();
  const { stone } = useGetStone();
  const { diamondAttributes } = useGetDiamondAttributes();
  const { diamondSizeWeightRate } = useGetDiamondSizeWeightRate(true);
  const [files, setFiles] = useState(currentSku?.SKUImages || []);

  const schema = Yup.object().shape({
    skuName: Yup.string().required('SKU Name is required'),
    category: Yup.object().required('Category is required'),
    product: Yup.object().required('Product is required'),
    design: Yup.object().required('Design is required'),
    purity: Yup.object().required('Purity is required'),
  });

  const defaultValues = useMemo(
    () => ({
      skuName: currentSku?.SKUName || '',
      stoneFields: currentSku?.stones || [],
      diamondFields: currentSku?.diamonds || [],
      vendor: currentSku?.vendor?.map((item) => ({
        label: item.vendorName,
        value: item._id,
      })) || [],
      productRemark: currentSku?.productRemark || '',
      category: currentSku?.category ? {
        label: currentSku.category.name,
        value: currentSku.category._id,
      } : null,
      product: currentSku?.product ? {
        label: currentSku.product.name,
        value: currentSku.product._id,
      } : null,
      design: currentSku?.design ? {
        label: currentSku.design.name,
        value: currentSku.design._id,
      } : null,
      purity: currentSku?.purity ? {
        label: currentSku.purity.name,
        value: currentSku.purity._id,
      } : null,
      images: currentSku?.SKUImages || [],
      description: currentSku?.desc || '',
      colour: currentSku?.colour || '',
      size: currentSku?.size || '',
      gWt: currentSku?.G_Wt || '',
      totalStWt: currentSku?.total_St_Wt || '',
      netWt: currentSku?.net_Wt || '',
      piece: currentSku?.pieces || '',
      minWeight: currentSku?.minWeight || '',
      minQuantity: currentSku?.minQuantity || '',
      weightCategories: currentSku?.weightCategory || [],
      clipWeight: currentSku?.clipWeight || '',
      tagWeight: currentSku?.tagWeight || '',
      findingWeight: currentSku?.findingWeight || '',
      lanyardWeight: currentSku?.lanyardWeight || '',
      otherWeight: currentSku?.otherWeight || '',
      pouchWeight: currentSku?.pouchWeight || '',
      makingPercentage: currentSku?.makingPer || '',
      makingPerGram: currentSku?.makingPerGram || '',
      makingFixedAmount: currentSku?.makingFixedAmount || '',
      metalAmount: currentSku?.metalAmount || 0,
      stoneAmount: currentSku?.stoneAmount || 0,
      labourAmount: currentSku?.labourAmount || 0,
      totalAmount: currentSku?.totalAmount || 0,
      mrp: currentSku?.MRP || 0,
    }),
    [currentSku],
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { control, setValue, handleSubmit, formState: { isSubmitting }, watch, reset } = methods;

  const { fields: diamondFields, append: appendDiamond, remove: removeDiamond } = useFieldArray({
    control,
    name: 'diamondFields',
  });

  const { fields: stoneFields, append: appendStone, remove: removeStone } = useFieldArray({
    control,
    name: 'stoneFields',
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append('SKUName', data.skuName);
    formData.append('desc', data.description);
    formData.append('productRemark', data.productRemark);
    formData.append('category', data.category?.value);
    formData.append('product', data.product?.value);
    formData.append('design', data.design?.value);
    formData.append('purity', data.purity?.value);
    formData.append('colour', data.colour);
    formData.append('size', data.size);
    formData.append('G_Wt', data.gWt);
    formData.append('total_St_Wt', data.totalStWt);
    formData.append('net_Wt', data.netWt);
    formData.append('pieces', data.piece);
    formData.append('minWeight', data.minWeight);
    formData.append('minQuantity', data.minQuantity);
    formData.append('clipWeight', data.clipWeight);
    formData.append('tagWeight', data.tagWeight);
    formData.append('findingWeight', data.findingWeight);
    formData.append('lanyardWeight', data.lanyardWeight);
    formData.append('otherWeight', data.otherWeight);
    formData.append('pouchWeight', data.pouchWeight);
    formData.append('makingPer', data.makingPercentage);
    formData.append('makingPerGram', data.makingPerGram);
    formData.append('makingFixedAmount', data.makingFixedAmount);
    formData.append('metalAmount', data.metalAmount);
    formData.append('stoneAmount', data.stoneAmount);
    formData.append('labourAmount', data.labourAmount);
    formData.append('totalAmount', data.totalAmount);
    formData.append('MRP', data.mrp);

    data.vendor.forEach((vendor, index) => {
      formData.append(`vendor[${index}]`, vendor.value);
    });

    data.weightCategories.forEach((category, index) => {
      formData.append(`weightCategory[${index}]`, category);
    });

    data.images.forEach((file) => formData.append('SKUImages', file));

    data.stoneFields.forEach((stone, index) => {
      formData.append(`stones[${index}][stoneName]`, stone.stoneName);
      formData.append(`stones[${index}][stone]`, stone.stone.label);
      formData.append(`stones[${index}][stoneWeight]`, stone.stoneWeight);
      formData.append(`stones[${index}][stonePieces]`, stone.stonePieces);
      formData.append(`stones[${index}][stoneAmount]`, stone.stoneAmount);
      formData.append(`stones[${index}][stoneDescription]`, stone.stoneDescription || '');
    });

    data.diamondFields.forEach((diamond, index) => {
      formData.append(`diamonds[${index}][diamondName]`, diamond.diamondName);
      formData.append(`diamonds[${index}][diamondShape]`, diamond.diamondShape.value);
      formData.append(`diamonds[${index}][diamondClarity]`, diamond.diamondClarity.value);
      formData.append(`diamonds[${index}][diamondColour]`, diamond.diamondColour.value);
      formData.append(`diamonds[${index}][diamondSize]`, diamond.diamondSize);
      formData.append(`diamonds[${index}][sieve]`, diamond.sieve);
      formData.append(`diamonds[${index}][diamondWeight]`, diamond.diamondWeight);
      formData.append(`diamonds[${index}][diamondRate]`, diamond.diamondRate);
      formData.append(`diamonds[${index}][diamondPieces]`, diamond.diamondPieces);
      formData.append(`diamonds[${index}][diamondCut]`, diamond.diamondCut.value);
      formData.append(`diamonds[${index}][settingType]`, diamond.settingType.value);
      formData.append(`diamonds[${index}][certificate]`, diamond.certificate);
      formData.append(`diamonds[${index}][description]`, diamond.description);
    });

    const url = currentSku
      ? `${ASSETS_API}/api/company/${user?.company}/sku/${currentSku._id}`
      : `${ASSETS_API}/api/company/${user?.company}/sku`;

    const method = currentSku ? 'put' : 'post';

    try {
      const response = await axios[method](url, formData);
      if (response.status === 200 || response.status === 201) {
        router.push(paths.dashboard.sku.list);
        reset(defaultValues);
        const successMessage = currentSku ? 'SKU successfully updated!' : 'SKU successfully created!';
        enqueueSnackbar(successMessage, { variant: 'success' });
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        console.error('Server Error:', error.response.data);
        enqueueSnackbar('Failed to save SKU. Please try again.', { variant: 'error' });
      } else if (error.request) {
        console.error('No Response:', error.request);
        enqueueSnackbar('No response from server. Please check your connection.', { variant: 'error' });
      } else {
        console.error('Error Message:', error.message);
        enqueueSnackbar('An unexpected error occurred. Please try again later.', { variant: 'error' });
      }
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setValue('images', [...files, ...newFiles]);
    },
    [files, setValue],
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = files.filter((file) => file !== inputFile);
      setFiles(filtered);
      setValue('images', filtered);
    },
    [files, setValue],
  );

  const SectionTitle = ({ title }) => (
    <Typography variant='h6' sx={{ mb: 3 }}>
      {title}
    </Typography>
  );

  const selectedVendors = watch('vendor');
  const weightCategories = watch('weightCategories');

  const handleAddItem = (arrayName, newItem, key = null) => {
    const currentArray = watch(arrayName);
    const exists = key
      ? currentArray.some((item) => item[key] === newItem[key])
      : currentArray.includes(newItem);

    if (newItem && !exists) {
      setValue(arrayName, [...currentArray, newItem]);
    }
  };

  const handleRemoveItem = (arrayName, itemToRemove, key = null) => {
    setValue(
      arrayName,
      watch(arrayName).filter((item) =>
        key ? item[key] !== itemToRemove[key] : item !== itemToRemove,
      ),
    );
  };

  const handleClearArray = (arrayName) => setValue(arrayName, []);

  const handleAddCategory = (e) => {
    const value = e.target.value.trim();
    if (value) handleAddItem('weightCategories', value);
    setValue('weightCategoriesInput', '');
  };

  const handleAddVendor = (newVendor) => handleAddItem('vendor', newVendor, 'value');
  const handleRemoveCategory = (category) => handleRemoveItem('weightCategories', category);
  const handleRemoveVendor = (vendor) => handleRemoveItem('vendor', vendor, 'value');
  const handleClearAll = () => handleClearArray('weightCategories');
  const handleVendorClearAll = () => handleClearArray('vendor');

  useEffect(() => {
    const gWtValue = watch('gWt');
    const totalStWtValue = watch('totalStWt');
    if (gWtValue && totalStWtValue) {
      const gWtParsed = parseFloat(gWtValue);
      const totalStWtParsed = parseFloat(totalStWtValue);
      if (!isNaN(gWtParsed) && !isNaN(totalStWtParsed)) {
        let netWt = gWtParsed - totalStWtParsed;
        if (netWt < 0) {
          netWt = 0;
          enqueueSnackbar('Net weight cannot be negative. It has been reset to 0.', { variant: 'error' });
        }
        setValue('netWt', netWt.toFixed(2));
      } else {
        setValue('netWt', '');
      }
    } else {
      setValue('netWt', '');
    }
  }, [watch('gWt'), watch('totalStWt'), setValue, enqueueSnackbar]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.startsWith('stoneFields') && name.endsWith('stone')) {
        const index = parseInt(name.match(/\d+/)[0], 10);
        const selectedStone = value?.stoneFields?.[index]?.stone;
        if (selectedStone) {
          const stoneDetails = stone?.find((s) => s._id === selectedStone.value);
          if (stoneDetails) {
            setValue(`stoneFields[${index}].stoneWeight`, stoneDetails.stoneWeight || '');
            setValue(`stoneFields[${index}].stonePieces`, stoneDetails.stonePieces || '');
            setValue(`stoneFields[${index}].stoneAmount`, stoneDetails.stoneAmount || '');
          }
        } else {
          setValue(`stoneFields[${index}].stoneWeight`, '');
          setValue(`stoneFields[${index}].stonePieces`, '');
          setValue(`stoneFields[${index}].stoneAmount`, '');
        }
      }
      if (name && name.startsWith('stoneFields') && name.endsWith('stonePieces')) {
        const index = parseInt(name.match(/\d+/)[0], 10);
        const stonePieces = parseFloat(value?.stoneFields?.[index]?.stonePieces || 0);
        const selectedStone = value?.stoneFields?.[index]?.stone;
        if (selectedStone) {
          const stoneDetails = stone?.find((s) => s._id === selectedStone.value);
          if (stoneDetails) {
            const stoneAmountPerPiece = parseFloat(stoneDetails.stoneAmount || 0);
            const newStoneAmount = (stonePieces * stoneAmountPerPiece).toFixed(2);
            setValue(`stoneFields[${index}].stoneAmount`, newStoneAmount);
          }
        }
      }
      if (name && name.startsWith('stoneFields') && name.endsWith('stoneAmount')) {
        const totalStoneAmount = value?.stoneFields.reduce((acc, stone) => acc + (Number(stone.stoneAmount) || 0), 0);
        setValue('stoneAmount', (totalStoneAmount).toFixed(2));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, stone]);

  useEffect(() => {
    const netWt = parseFloat(watch('netWt') || 0);
    const selectedPurity = watch('purity')?.value;
    const finalPurity = purity.find((purity) => purity?._id === selectedPurity);

    if (netWt && selectedPurity) {
      const purityValue = parseFloat(finalPurity?.today_rate || 0);
      if (!isNaN(purityValue)) {
        const totalMetalAmount = ((netWt * purityValue) / 10).toFixed(2);
        setValue('metalAmount', (totalMetalAmount));
      } else {
        setValue('metalAmount', 0);
      }
    } else {
      setValue('metalAmount', 0);
    }
  }, [watch('netWt'), watch('purity'), setValue]);

  useEffect(() => {
    const netWt = parseFloat(watch('netWt') || 0);
    const makingPercentage = parseFloat(watch('makingPercentage') || 0);
    const makingPerGram = parseFloat(watch('makingPerGram') || 0);
    const makingFixedAmount = parseFloat(watch('makingFixedAmount') || 0);
    const selectedPurityId = watch('purity')?.value;
    const selectedPurity = purity.find((item) => item._id === selectedPurityId);
    const purityRate = parseFloat(selectedPurity?.today_rate || 0);

    if (!isNaN(netWt) && !isNaN(purityRate)) {
      const m1 = ((purityRate * netWt) / 10) * (makingPercentage / 100);
      const m2 = netWt * makingPerGram;
      const m3 = makingFixedAmount;
      const totalLabourAmount = (m1 + m2 + m3).toFixed(2);
      setValue('labourAmount', totalLabourAmount);
    } else {
      setValue('labourAmount', 0);
    }
  }, [watch('netWt'), watch('makingPercentage'), watch('makingPerGram'), watch('makingFixedAmount'), watch('purity'), setValue, purity]);

  useEffect(() => {
    const metalAmount = parseFloat(watch('metalAmount') || 0);
    const stoneAmount = parseFloat(watch('stoneAmount') || 0);
    const labourAmount = parseFloat(watch('labourAmount') || 0);

    if (!isNaN(metalAmount) && !isNaN(stoneAmount) && !isNaN(labourAmount)) {
      const total = (metalAmount + stoneAmount + labourAmount).toFixed(2);
      const mrp = parseFloat(watch('mrp') || 0);
      setValue('totalAmount', total);
      setValue('mrp', total);
    } else {
      setValue('totalAmount', '');
    }
  }, [watch('metalAmount'), watch('stoneAmount'), watch('labourAmount'), watch('mrp'), setValue, enqueueSnackbar]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (
        name &&
        /diamondFields\[\d+\]\.(diamondShape|diamondClarity|diamondColour|diamondSize|sieve)/.test(name)
      ) {
        const index = Number(name.match(/\d+/)?.[0]);
        if (isNaN(index)) return;

        const diamondField = value?.diamondFields?.[index];
        const { diamondShape, diamondClarity, diamondColour, diamondSize, sieve } = diamondField || {};

        if (diamondShape || diamondClarity || diamondColour || diamondSize || sieve) {
          let highestMatchCount = 0;
          let rateForHighestMatch = null;
          let matchCount = 0;
          console.log(diamondSizeWeightRate?.items);
          diamondSizeWeightRate?.items?.forEach((item) => {
            const matches = [
              item?.diamondShape === diamondShape?.value,
              item?.diamondClarity === diamondClarity?.value,
              item?.diamondSize === diamondSize,
              item?.sieve === sieve,
              item?.diamondColor === diamondColour?.value,
            ];
            matchCount = matches.filter(Boolean).length >= 2;

            if (matchCount > highestMatchCount) {
              highestMatchCount = matchCount;
              rateForHighestMatch = item?.diamondPurchaseRate;
            }
          });

          // if (!rateForHighestMatch) {
          //   let nearestTemplate = null;
          //   let smallestDifference = Infinity;
          //
          //   diamondSizeWeightRate.items.forEach((item) => {
          //     const sizeDifference = Math.abs(item.diamondSize - diamondSize);
          //     const sieveDifference = Math.abs(item.sieve - sieve);
          //     const totalDifference = sizeDifference + sieveDifference;
          //
          //     if (totalDifference < smallestDifference) {
          //       smallestDifference = totalDifference;
          //       nearestTemplate = item;
          //     }
          //   });
          //
          //   if (nearestTemplate) {
          //     rateForHighestMatch = nearestTemplate.diamondPurchaseRate;
          //   }
          // }

          if (rateForHighestMatch !== null) {
            setValue(`diamondFields[${index}].diamondRate`, rateForHighestMatch);
          } else {
            setValue(`diamondFields[${index}].diamondRate`, '');
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue, diamondSizeWeightRate]);

  const categoryValue = watch('category')?.value;
  const productValue = watch('product')?.value;

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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <SectionTitle title='Add New SKU' />
            <Box
              display='grid'
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)' }}
            >
              <RHFTextField req={'red'} name='skuName' label='SKU Name' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <Controller
                name='vendorInput'
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <RHFAutocomplete
                    {...field}
                    label='Vendor'
                    placeholder='Choose a Vendor'
                    options={vendor?.map((item) => ({ label: item.vendorName, value: item._id })) || []}
                    isOptionEqualToValue={(option, value) => option.value === value?.value}
                    onChange={(_, newValue) => {
                      handleAddVendor(newValue);
                      setValue('vendorInput', null);
                    }}
                  />
                )}
              />
              {selectedVendors.length > 0 && (
                <Box display='flex' flexWrap='wrap' gap={1} alignItems='center'>
                  {selectedVendors.map((vendor, index) => (
                    <Chip key={index} label={vendor.label} onDelete={() => handleRemoveVendor(vendor)} />
                  ))}
                  <Tooltip title='Clear All'>
                    <IconButton onClick={handleVendorClearAll}>
                      <Iconify icon='pajamas:remove-all' />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
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
                options={filteredProduct || []}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFAutocomplete
                req={'red'}
                name='design'
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
              <RHFTextField name='colour' label='Colour' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='size' label='Size' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFTextField
                name='gWt'
                label='G, Wt'
                inputProps={{
                  inputMode: 'decimal',
                  pattern: '^[0-9]*\\.?[0-9]{0,2}$',
                }}
                onInput={(e) => {
                  const value = e.target.value;
                  if (!/^\d*\.?\d{0,2}$/.test(value)) {
                    e.target.value = value.slice(0, -1);
                  }
                }}
              />
              <RHFTextField name='totalStWt' label='Total St.Wt' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFTextField name='netWt' label='Net.Wt' disabled />
              <RHFTextField name='piece' label='Piece' onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
                            inputProps={{ pattern: '[0-9]*' }} />
              <RHFTextField name='minWeight' label='Min Weight' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFTextField name='minQuantity' label='Min Quantity' onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
                            inputProps={{ pattern: '[0-9]*' }} />
              <Controller
                name='weightCategoriesInput'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <RHFTextField
                    {...field}
                    label='Weight Categories'
                    inputProps={{
                      inputMode: 'decimal',
                      pattern: '^[0-9]*\\.?[0-9]{0,2}$',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory(e);
                      }
                    }}
                    onInput={(e) => {
                      const value = e.target.value;
                      if (!/^\d*\.?\d{0,2}$/.test(value)) {
                        e.target.value = value.slice(0, -1);
                      }
                    }}
                  />
                )}
              />
              {weightCategories.length > 0 && (
                <Box display='flex' flexWrap='wrap' gap={1} alignItems='center'>
                  {weightCategories.map((category, index) => (
                    <Chip key={index} label={category} onDelete={() => handleRemoveCategory(category)} />
                  ))}
                  <Tooltip title='Clear All'>
                    <IconButton onClick={handleClearAll}>
                      <Iconify icon='pajamas:remove-all' />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              <RHFTextField name='description' label='Description' multiline
                            rows={weightCategories.length > 0 ? 2 : 1} />
              <RHFTextField name='productRemark' label='Product Remark' />
              <Stack direction='row' flexWrap='wrap'>
                <MultiFilePreview
                  thumbnail
                  files={files}
                  onRemove={handleRemoveFile}
                  sx={{ width: 64, height: 64 }}
                />
                <UploadBox onDrop={handleDrop} />
              </Stack>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <SectionTitle title='Additional Weights' />
            <Box
              display='grid'
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)' }}
              sx={{ mb: 3 }}
            >
              <RHFTextField name='clipWeight' label='Clip Weight' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFTextField name='tagWeight' label='Tag Weight' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFTextField name='findingWeight' label='Finding Weight' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFTextField name='lanyardWeight' label='Lanyard Weight' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFTextField name='otherWeight' label='Other Weight' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFTextField name='pouchWeight' label='Pouch Weight' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
            </Box>
            <SectionTitle title='Add Labour' />
            <Box
              display='grid'
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)' }}
            >
              <RHFTextField name='makingPercentage' label='Making Percentage' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFTextField name='makingPerGram' label='Making Per/Gram' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
              <RHFTextField name='makingFixedAmount' label='Making Fixed Amount' inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*\\.?[0-9]{0,2}$',
              }}
                            onInput={(e) => {
                              const value = e.target.value;
                              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                                e.target.value = value.slice(0, -1);
                              }
                            }} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant='h6' sx={{ mb: 3 }}>Add Stone</Typography>
            {stoneFields.map((field, index) => (
              <Box
                key={field.id}
                display='grid'
                rowGap={3}
                columnGap={2}
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)' }}
                sx={{ mb: 3 }}
              >
                <RHFTextField name={`stoneFields[${index}].stoneName`} label='Stone Name' onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }} />
                <RHFAutocomplete
                  name={`stoneFields[${index}].stone`}
                  label='Select Stone'
                  placeholder='Choose a Stone'
                  options={stone?.map((cate) => ({
                    label: cate.name,
                    value: cate._id,
                  })) || []}
                  isOptionEqualToValue={(option, value) => option.value === value}
                />
                <RHFTextField
                  name={`stoneFields[${index}].stoneWeight`}
                  label='Stone Weight'
                  inputProps={{
                    inputMode: 'decimal',
                    pattern: '^[0-9]*\\.?[0-9]{0,2}$',
                    shrink: true,
                  }}
                  onInput={(e) => {
                    const value = e.target.value;
                    if (!/^\d*\.?\d{0,2}$/.test(value)) {
                      e.target.value = value.slice(0, -1);
                    }
                  }}
                />
                <RHFTextField
                  name={`stoneFields[${index}].stonePieces`}
                  label='Stone Pieces'
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  }}
                  inputProps={{ pattern: '[0-9]*', shrink: true }}
                />
                <RHFTextField
                  name={`stoneFields[${index}].stoneAmount`}
                  label='Stone Amount'
                  inputProps={{
                    inputMode: 'decimal',
                    pattern: '^[0-9]*\\.?[0-9]{0,2}$',
                    shrink: true,
                  }}
                  onInput={(e) => {
                    const value = e.target.value;
                    if (!/^\d*\.?\d{0,2}$/.test(value)) {
                      e.target.value = value.slice(0, -1);
                    }
                  }}
                />
                <RHFTextField name={`stoneFields[${index}].stoneDescription`} label='Stone Description' />
                <Box></Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <IconButton
                    onClick={() => {
                      setValue(`stoneFields[${index}]`, {
                        stoneName: '',
                        stone: null,
                        stoneWeight: '',
                        stonePieces: '',
                        stoneAmount: '',
                        stoneDescription: '',
                      });
                    }}
                  >
                    <Iconify icon='bx:reset' />
                  </IconButton>
                  <IconButton
                    onClick={() => removeStone(index)}
                  >
                    <Iconify icon='pajamas:remove-all' />
                  </IconButton>
                </Box>
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant='contained'
                onClick={() => appendStone({
                  stoneName: '',
                  stone: null,
                  stoneWeight: '',
                  stonePieces: '',
                  stoneAmount: '',
                  stoneDescription: '',
                })}
              >
                Add Stone
              </Button>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <SectionTitle title='Add Diamond' />
            {diamondFields.map((item, index) => (
              <Box
                display='grid'
                rowGap={3}
                columnGap={2}
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(5, 1fr)' }}
                sx={{ mb: 3 }}
              >
                <RHFTextField
                  name={`diamondFields[${index}].diamondName`}
                  label='Diamond Name'
                  onInput={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                />
                <RHFAutocomplete
                  name={`diamondFields[${index}].diamondShape`}
                  label='Select Diamond Shape'
                  placeholder='Choose a Diamond Shape'
                  options={diamondAttributes
                    ?.filter((shape) => shape?.diamondAttribute === 'shape')
                    .map((shap) => ({
                      label: shap.diamondValue,
                      value: shap.diamondValue,
                    }))}
                  isOptionEqualToValue={(option, value) => option.value === value}
                />
                <RHFAutocomplete
                  name={`diamondFields[${index}].diamondClarity`}
                  label='Select Diamond Clarity'
                  placeholder='Choose a Diamond Clarity'
                  options={diamondAttributes
                    ?.filter((shape) => shape?.diamondAttribute === 'clarity')
                    .map((shap) => ({
                      label: shap.diamondValue,
                      value: shap.diamondValue,
                    }))}
                  isOptionEqualToValue={(option, value) => option.value === value}
                />
                <RHFAutocomplete
                  name={`diamondFields[${index}].diamondColour`}
                  label='Select Diamond Colour'
                  placeholder='Choose a Diamond Colour'
                  options={diamondAttributes
                    ?.filter((shape) => shape?.diamondAttribute === 'color')
                    .map((shap) => ({
                      label: shap.diamondValue,
                      value: shap.diamondValue,
                    }))}
                  isOptionEqualToValue={(option, value) => option.value === value}
                />
                <RHFTextField
                  name={`diamondFields[${index}].diamondSize`}
                  label='Diamond Size'
                  inputProps={{
                    inputMode: 'decimal',
                    pattern: '^[0-9]*\\.?[0-9]{0,2}$',
                  }}
                  onInput={(e) => {
                    const value = e.target.value;
                    if (!/^\d*\.?\d{0,2}$/.test(value)) {
                      e.target.value = value.slice(0, -1);
                    }
                  }}
                />
                <RHFTextField
                  name={`diamondFields[${index}].sieve`}
                  label='Sieve'
                  inputProps={{
                    inputMode: 'decimal',
                    pattern: '^[0-9]*\\.?[0-9]{0,2}$',
                  }}
                  onInput={(e) => {
                    const value = e.target.value;
                    if (!/^\d*\.?\d{0,2}$/.test(value)) {
                      e.target.value = value.slice(0, -1);
                    }
                  }}
                />
                <RHFTextField
                  name={`diamondFields[${index}].diamondWeight`}
                  label='Diamond Weight'
                  inputProps={{
                    inputMode: 'decimal',
                    pattern: '^[0-9]*\\.?[0-9]{0,2}$',
                  }}
                  onInput={(e) => {
                    const value = e.target.value;
                    if (!/^\d*\.?\d{0,2}$/.test(value)) {
                      e.target.value = value.slice(0, -1);
                    }
                  }}
                />
                <RHFTextField
                  name={`diamondFields[${index}].diamondRate`}
                  label='Diamond Rate'
                  inputProps={{
                    inputMode: 'decimal',
                    pattern: '^[0-9]*\\.?[0-9]{0,2}$',
                    shrink: true,
                  }}
                  onInput={(e) => {
                    const value = e.target.value;
                    if (!/^\d*\.?\d{0,2}$/.test(value)) {
                      e.target.value = value.slice(0, -1);
                    }
                  }}
                />
                <RHFTextField
                  name={`diamondFields[${index}].diamondPieces`}
                  label='Diamond Pieces'
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  }}
                  inputProps={{ pattern: '[0-9]*' }}
                />
                <RHFAutocomplete
                  name={`diamondFields[${index}].diamondCut`}
                  label='Select Diamond Cut'
                  placeholder='Choose a Diamond Cut'
                  options={diamondAttributes
                    ?.filter((shape) => shape?.diamondAttribute === 'cut')
                    .map((shap) => ({
                      label: shap.diamondValue,
                      value: shap.diamondValue,
                    }))}
                  isOptionEqualToValue={(option, value) => option.value === value}
                />
                <RHFAutocomplete
                  name={`diamondFields[${index}].settingType`}
                  label='Setting Type'
                  placeholder='Choose a Setting Type'
                  options={diamondAttributes
                    ?.filter((shape) => shape?.diamondAttribute === 'settingtype')
                    .map((shap) => ({
                      label: shap.diamondValue,
                      value: shap.diamondValue,
                    }))}
                  isOptionEqualToValue={(option, value) => option.value === value}
                />
                <RHFTextField
                  name={`diamondFields[${index}].certificate`}
                  label='Certificate'
                  onInput={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                />
                <RHFTextField
                  name={`diamondFields[${index}].description`}
                  label='Description'
                />
                <Box></Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <IconButton
                    onClick={() => {
                      setValue(`diamondFields[${index}]`, {
                        description: '',
                        certificate: '',
                        settingType: null,
                        diamondCut: null,
                        diamondPieces: '',
                        diamondRate: '',
                        diamondWeight: '',
                        sieve: '',
                        diamondSize: '',
                        diamondColour: null,
                        diamondClarity: null,
                        diamondShape: null,
                        diamondName: '',
                      });
                    }}
                    sx={{ cursor: 'pointer', marginRight: 2 }}
                  >
                    <Iconify icon='bx:reset' />
                  </IconButton>
                  <IconButton
                    onClick={() => removeDiamond(index)}
                  >
                    <Iconify icon='pajamas:remove-all' />
                  </IconButton>
                </Box>
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant='contained'
                onClick={() =>
                  appendDiamond({
                    description: '',
                    certificate: '',
                    settingType: null,
                    diamondCut: null,
                    diamondPieces: '',
                    diamondRate: '',
                    diamondWeight: '',
                    sieve: '',
                    diamondSize: '',
                    diamondColour: null,
                    diamondClarity: null,
                    diamondShape: null,
                    diamondName: '',
                  })
                }
              >
                Add Diamond Field
              </Button>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              display='grid'
              rowGap={3}
              columnGap={2}
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(5, 1fr)' }}
            >
              <RHFTextField
                name='metalAmount'
                label='Metal Amount'
                disabled
              />
              <RHFTextField
                name='stoneAmount'
                label='Stone Amount'
                disabled
              />
              <RHFTextField
                name='labourAmount'
                label='Labour Amount'
                disabled
              />
              <RHFTextField
                name='totalAmount'
                label='Total Amount'
                disabled
              />
              <RHFTextField
                name='mrp'
                label='MRP'
                inputProps={{
                  step: 'any',
                  min: '0',
                  pattern: '[0-9]*[.,]?[0-9]*',
                }}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Stack direction='row' justifyContent='flex-end' spacing={2}>
            <Button
              variant='contained'
              onClick={() => reset(defaultValues)}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
              Submit
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

SkuNewEditForm.propTypes = {
  currentSku: PropTypes.object,
};
