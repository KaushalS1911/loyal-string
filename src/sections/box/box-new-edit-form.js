import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
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
import { Chip, IconButton, Tooltip } from '@mui/material';
import Iconify from '../../components/iconify';

export default function BoxNewEditForm({ currentBox }) {
  const { enqueueSnackbar } = useSnackbar();
  const [master, setMaster] = useState([]);
  const router = useRouter();
  const { user } = useAuthContext();
  const { branch } = useGetBranch();
  const { category } = useGetCategory();
  const { product } = useGetProduct();
  const { packet } = useGetPacket();
  const [localPacketMaster, setLocalPacketMaster] = useState([]);

  const schema = Yup.object().shape({
    branch: Yup.object().required('Branch is required'),
    category: Yup.object().required('Category is required'),
    product: Yup.object().required('Product is required'),
    boxName: Yup.string().required('Box Name is required'),
    emptyWeight: Yup.number()
      .typeError('Empty Weight must be a number')
      .positive('Empty Weight must be positive')
      .required('Empty Weight is required'),
  });

  const defaultValues = useMemo(() => (
    {
      branch: currentBox?.branch ? {
        label: currentBox.branch.name,
        value: currentBox.branch._id,
      } : null,
      category: currentBox?.category ? {
        label: currentBox.category.name,
        value: currentBox.category._id,
      } : null,
      product: currentBox?.product ? {
        label: currentBox.product.name,
        value: currentBox.product._id,
      } : null,
      boxName: currentBox?.name || '',
      emptyWeight: currentBox?.emptyWeight || '',
      description: currentBox?.desc || '',
      packetMaster: [],
    }), [currentBox]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    control,
    setValue,
    watch,
  } = methods;

  useEffect(() => {
    setMaster(currentBox?.packetMaster?.map((item) => ({
      label: item.name,
      value: item._id,
    })) || []);
  }, [currentBox]);

  useEffect(() => {
    setValue('packetMaster', localPacketMaster);
  }, [localPacketMaster, setValue]);

  const onSubmit = async (data) => {
    try {
      const apiUrl = `${ASSETS_API}/api/company/${user?.company}/box`;
      const payload = {
        branch: data.branch?.value || [],
        category: data.category?.value || [],
        product: data.product?.value || [],
        name: data.boxName,
        emptyWeight: String(data.emptyWeight),
        desc: data.description,
        packetMaster: master.map((packet) => packet.value) || [],
      };

      if (currentBox?._id) {
        payload._id = currentBox._id;
        await axios.put(`${apiUrl}/${currentBox._id}`, payload);
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

  const handleAddPacket = (newPacket) => {
    if (newPacket) {
      const packet = master.find((item) => item.value == newPacket.value);
      if (!packet) {
        setMaster((prevState) => [...prevState, newPacket]);
      }
      setValue('packetMaster', []);
    }
  };

  const handleRemovePacket = (packetToRemove) => {
    setMaster((prevState) => prevState.filter((packet) => packet.value !== packetToRemove.value));
  };

  const handleClearAll = () => {
    setLocalPacketMaster([]);
    setMaster([]);
  };

  const branchOptions = useMemo(() => branch?.map((item) => ({
    label: item.name,
    value: item._id,
  })) || [], [branch]);

  const categoryOptions = useMemo(() => category?.map((item) => ({
    label: item.name,
    value: item._id,
  })) || [], [category]);

  const productOptions = useMemo(() => product?.map((item) => ({
    label: item.name,
    value: item._id,
  })) || [], [product]);

  const packetOptions = useMemo(() => packet?.map((item) => ({
    label: item.name,
    value: item._id,
  })) || [], [packet]);

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
                req={'red'}
                name='branch'
                label='Branch'
                options={branchOptions}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFAutocomplete
                req={'red'}
                name='category'
                label='Category'
                options={categoryOptions}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <RHFAutocomplete
                req={'red'}
                name='product'
                label='Product'
                options={productOptions}
                isOptionEqualToValue={(option, value) => option.value === value}
              />
              <Controller
                name='packetMaster'
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <>
                    <RHFAutocomplete
                      {...field}
                      label='Packet Master'
                      placeholder='Choose a Packet'
                      options={packetOptions}
                      isOptionEqualToValue={(option, value) => option.value === value?.value}
                      filterOptions={(options) =>
                        options.filter(
                          (option) => !master?.some((vendor) => vendor.value === option.value),
                        )
                      }
                      onChange={(_, newValue) => {
                        if (newValue) {
                          handleAddPacket(newValue);
                        }
                      }}
                    />
                    {master?.length > 0 && (
                      <Box display='flex' flexWrap='wrap' gap={1} alignItems='center'>
                        {master?.map((packet, index) => (
                          <Chip
                            key={index}
                            label={packet.label}
                            onDelete={() => handleRemovePacket(packet)}
                          />
                        ))}
                        <Tooltip title='Clear All'>
                          <IconButton onClick={handleClearAll}>
                            <Iconify icon='pajamas:remove-all' />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </>
                )}
              />
              <RHFTextField
                req={'red'}
                name='boxName'
                label='Box Name'
                onInput={(e) => e.target.value = e.target.value.toUpperCase()}
              />
              <RHFTextField
                req={'red'}
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
