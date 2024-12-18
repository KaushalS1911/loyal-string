import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useGetDiamondAttributes } from '../../api/diamond-attributes';
import { ASSETS_API } from '../../config-global';
import { useAuthContext } from '../../auth/hooks';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';

export default function DiamondSizeWeightRateNewEditForm({ currentDiamondSizeWeightRate }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const router = useRouter();
  const { diamondAttributes } = useGetDiamondAttributes();
  const [diamondData, setDiamondData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const schema = Yup.object().shape({
    templateName: Yup.string().required('Template Name is required'),
    diamondShape: Yup.object().required('Diamond Shape is required'),
    diamondClarity: Yup.object().required('Diamond Clarity is required'),
    diamondCut: Yup.object().required('Diamond Cut is required'),
    diamondColor: Yup.object().required('Diamond Color is required'),
    diamondSettingType: Yup.object().required('Diamond Setting Type is required'),
    diamondSize: Yup.string().required('Diamond Size is required'),
    sieve: Yup.string().required('Sieve is required'),
    diamondWeight: Yup.string().required('Diamond Weight is required'),
    diamondPurchaseRate: Yup.string().required('Diamond Purchase Rate is required'),
    margin: Yup.string().required('Diamond Margin is required'),
    sellRate: Yup.string().nullable(),
  });

  useEffect(() => {
    if (currentDiamondSizeWeightRate) {
      setDiamondData(currentDiamondSizeWeightRate.items.map(item => ({
        ...item,
        templateName: currentDiamondSizeWeightRate?.templateName,
        diamondShape: { label: item.diamondShape, value: item.diamondShape },
        diamondClarity: { label: item.diamondClarity, value: item.diamondClarity },
        diamondCut: { label: item.diamondCut, value: item.diamondCut },
        diamondColor: { label: item.diamondColor, value: item.diamondColor },
        diamondSettingType: { label: item.diamondSettingType, value: item.diamondSettingType },
      })));
    }
  }, [currentDiamondSizeWeightRate]);

  const defaultValues = useMemo(() => ({
    templateName: currentDiamondSizeWeightRate?.templateName || 'default',
    diamondShape: null,
    diamondClarity: null,
    diamondCut: null,
    diamondColor: null,
    diamondSettingType: null,
    diamondSize: '',
    sieve: '',
    diamondWeight: '',
    diamondPurchaseRate: '',
    margin: '',
    sellRate: '',
  }), [currentDiamondSizeWeightRate]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    trigger,
    formState: { isSubmitting },
    watch,
  } = methods;

  const onSubmit = async () => {
    try {
      if (!diamondData.length) {
        enqueueSnackbar('Add at least one diamond entry.', { variant: 'warning' });
        return;
      }

      const payload = {
        templateName: diamondData[0]?.templateName || 'default',
        items: diamondData.map(item => ({
          diamondShape: item.diamondShape.value,
          diamondClarity: item.diamondClarity.value,
          diamondCut: item.diamondCut.value,
          diamondColor: item.diamondColor.value,
          diamondSettingType: item.diamondSettingType.value,
          diamondSize: item.diamondSize,
          sieve: item.sieve,
          diamondWeight: item.diamondWeight,
          diamondPurchaseRate: item.diamondPurchaseRate,
          margin: item.margin,
          sellRate: item.sellRate,
        })),
      };

      const apiRequest = currentDiamondSizeWeightRate
        ? axios.put(`${ASSETS_API}/api/company/${user?.company}/diamond/${currentDiamondSizeWeightRate._id}`, payload)
        : axios.post(`${ASSETS_API}/api/company/${user?.company}/diamond`, payload);

      await apiRequest;
      enqueueSnackbar(currentDiamondSizeWeightRate ? 'Updated successfully!' : 'Created successfully!', { variant: 'success' });
      router.push(paths.dashboard.diamondsizeweightrate.list);
      reset(defaultValues);
      setDiamondData([]);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Submission failed. Try again.', { variant: 'error' });
    }
  };

  const handleAddData = async () => {
    const isValid = await trigger();
    if (isValid) {
      const data = methods.getValues();
      const isTemplateNameValid = diamondData.every((item) => item.templateName === data.templateName);
      if (!isTemplateNameValid) {
        enqueueSnackbar('The Template Name must be the same as the existing one in the table.', { variant: 'error' });
        return;
      }
      if (editingIndex !== null) {
        const updatedDiamondData = [...diamondData];
        updatedDiamondData[editingIndex] = data;
        setDiamondData(updatedDiamondData);
        enqueueSnackbar('Diamond entry updated successfully!', { variant: 'success' });
      } else {
        setDiamondData((prevData) => [...prevData, data]);
        enqueueSnackbar('Diamond entry added successfully!', { variant: 'success' });
      }
      reset(defaultValues);
      setEditingIndex(null);
    } else {
      enqueueSnackbar('Please correct the errors before adding the entry!', { variant: 'error' });
    }
  };

  const handleDeleteData = (index) => {
    setDiamondData((prevData) => prevData.filter((_, idx) => idx !== index));
    enqueueSnackbar('Diamond entry deleted successfully!', { variant: 'info' });
  };

  const handleEditData = (index) => {
    const dataToEdit = diamondData[index];
    setValue('templateName', dataToEdit.templateName);
    setValue('diamondShape', dataToEdit.diamondShape);
    setValue('diamondClarity', dataToEdit.diamondClarity);
    setValue('diamondCut', dataToEdit.diamondCut);
    setValue('diamondColor', dataToEdit.diamondColor);
    setValue('diamondSettingType', dataToEdit.diamondSettingType);
    setValue('diamondSize', dataToEdit.diamondSize);
    setValue('sieve', dataToEdit.sieve);
    setValue('diamondWeight', dataToEdit.diamondWeight);
    setValue('diamondPurchaseRate', dataToEdit.diamondPurchaseRate);
    setValue('margin', dataToEdit.margin);
    setValue('sellRate', dataToEdit.sellRate);
    setEditingIndex(index);
  };

  useEffect(() => {
    const diamondPurchaseRate = watch('diamondPurchaseRate');
    const margin = watch('margin');
    if (diamondPurchaseRate && margin) {
      const calculatedSellRate = (diamondPurchaseRate * (1 + margin / 100)).toFixed(2);
      setValue('sellRate', calculatedSellRate);
    }
  }, [watch('diamondPurchaseRate'), watch('margin'), setValue]);

  const handleReset = () => {
    reset(defaultValues);
    setEditingIndex(null);
    enqueueSnackbar('Form reset successfully!', { variant: 'info' });
  };

  const handleTableReset = () => {
    setDiamondData([]);
    enqueueSnackbar('All table data has been cleared!', { variant: 'info' });
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={10}>
            <Typography variant='h6' sx={{ mb: 1 }}>
              {currentDiamondSizeWeightRate ? 'Edit Diamond Size/Weight/Rate' : 'Add New Diamond Size/Weight/Rate'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={2} display='flex' justifyContent='flex-end'>
            <RHFTextField name='templateName' label='Template Name' fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Box
                display='grid'
                rowGap={3}
                columnGap={2}
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(4, 1fr)',
                }}
              >
                <RHFAutocomplete
                  name='diamondShape'
                  label='Select Diamond Shape'
                  options={diamondAttributes
                    ?.filter((shape) => shape?.diamondAttribute === 'shape')
                    .map((shap) => ({
                      label: shap.diamondValue,
                      value: shap.diamondValue,
                    }))}
                  isOptionEqualToValue={(option, value) => option.value === value} />
                <RHFAutocomplete name='diamondClarity' label='Select Diamond Clarity' options={diamondAttributes
                  ?.filter((shape) => shape?.diamondAttribute === 'clarity')
                  .map((shap) => ({
                    label: shap.diamondValue,
                    value: shap.diamondValue,
                  }))}
                                 isOptionEqualToValue={(option, value) => option.value === value} />
                <RHFAutocomplete name='diamondCut' label='Select Diamond Cut' options={diamondAttributes
                  ?.filter((shape) => shape?.diamondAttribute === 'cut')
                  .map((shap) => ({
                    label: shap.diamondValue,
                    value: shap.diamondValue,
                  }))}
                                 isOptionEqualToValue={(option, value) => option.value === value} />
                <RHFAutocomplete name='diamondColor' label='Select Diamond Color' options={diamondAttributes
                  ?.filter((shape) => shape?.diamondAttribute === 'color')
                  .map((shap) => ({
                    label: shap.diamondValue,
                    value: shap.diamondValue,
                  }))}
                                 isOptionEqualToValue={(option, value) => option.value === value} />
                <RHFAutocomplete name='diamondSettingType' label='Select Setting Type' options={diamondAttributes
                  ?.filter((shape) => shape?.diamondAttribute === 'settingtype')
                  .map((shap) => ({
                    label: shap.diamondValue,
                    value: shap.diamondValue,
                  }))}
                                 isOptionEqualToValue={(option, value) => option.value === value} />
                <RHFTextField name='diamondSize' label='Diamond Size' onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }} />
                <RHFTextField name='sieve' label='Sieve' onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }} />
                <RHFTextField name='diamondWeight' label='Diamond Weight' type='number' inputProps={{
                  step: 'any',
                  min: '0',
                  pattern: '[0-9]*[.,]?[0-9]*',
                }} />
                <RHFTextField name='diamondPurchaseRate' label='Diamond Purchase Rate' type='number' inputProps={{
                  step: 'any',
                  min: '0',
                  pattern: '[0-9]*[.,]?[0-9]*',
                }} />
                <RHFTextField name='margin' label='Margin' type='number' inputProps={{
                  step: 'any',
                  min: '0',
                  pattern: '[0-9]*[.,]?[0-9]*',
                }} />
                <RHFTextField name='sellRate' label='Diamond Sell Rate' type='number' inputProps={{
                  step: 'any',
                  min: '0',
                  pattern: '[0-9]*[.,]?[0-9]*',
                  shrink: true,
                }} />
              </Box>
              <Box display='flex' justifyContent={'space-between'} alignItems={'center'} sx={{ mt: 2 }}>
                <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
                  <Button variant='outlined' type='button' onClick={handleAddData}>
                    {editingIndex !== null ? 'Update' : 'Add'}
                  </Button>
                  <Button variant='outlined' type='button' onClick={handleReset}>
                    Reset Form
                  </Button>
                </Stack>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sx={{ mt: 4 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sr.No.</TableCell>
                    <TableCell>Template Name</TableCell>
                    <TableCell>Dia Shape</TableCell>
                    <TableCell>Dia Clarity</TableCell>
                    <TableCell>Dia Color</TableCell>
                    <TableCell>Dia Size</TableCell>
                    <TableCell>Sieve</TableCell>
                    <TableCell>Dia Weight</TableCell>
                    <TableCell>Dia Purchase Rate</TableCell>
                    <TableCell>Dia Sell Rate</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {diamondData.map((item, index) => (
                    <TableRow hover key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.templateName}</TableCell>
                      <TableCell>{item.diamondShape.value}</TableCell>
                      <TableCell>{item.diamondClarity.value}</TableCell>
                      <TableCell>{item.diamondColor.value}</TableCell>
                      <TableCell>{item.diamondSize}</TableCell>
                      <TableCell>{item.sieve}</TableCell>
                      <TableCell>{item.diamondWeight}</TableCell>
                      <TableCell>{item.diamondPurchaseRate}</TableCell>
                      <TableCell>{item.sellRate}</TableCell>
                      <TableCell>
                        <Stack direction='row' spacing={1}>
                          <Button variant='outlined' onClick={() => handleEditData(index)}>
                            Edit
                          </Button>
                          <Button variant='outlined' onClick={() => handleDeleteData(index)}>
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </FormProvider>
      <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
        <Button variant='outlined' onClick={handleTableReset}>
          Reset Table
        </Button>
        <LoadingButton variant='contained' type='button' onClick={onSubmit} loading={isSubmitting}>
          {currentDiamondSizeWeightRate ? 'Update' : 'Create'}
        </LoadingButton>
      </Stack>
    </>
  );
}

DiamondSizeWeightRateNewEditForm.propTypes = {
  currentDiamondSizeWeightRate: PropTypes.object,
};
