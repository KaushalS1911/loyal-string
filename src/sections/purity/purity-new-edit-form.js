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
import { useAuthContext } from '../../auth/hooks';
import { useGetCategory } from '../../api/category';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';
import axios from 'axios';
import { ASSETS_API } from '../../config-global';

export default function PurityNewEditForm({ currentPurity }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { category } = useGetCategory();
  const router = useRouter();

  const schema = Yup.object().shape({
    shortName: Yup.string().required('Company Short Name is required'),
    purityName: Yup.string().required('Purity Name is required'),
    finePercentage: Yup.string().required('Fine Percentage is required'),
    description: Yup.string(),
    category: Yup.object().required('Category is required'),
  });

  const defaultValues = useMemo(() => ({
    shortName: currentPurity?.short_name || '',
    purityName: currentPurity?.name || '',
    finePercentage: currentPurity?.fine_percentage || '',
    description: currentPurity?.desc || '',
    category: currentPurity ? {
      label: currentPurity?.category?.name,
      value: currentPurity?.category?._id,
    } : null,
  }), [currentPurity]);

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
        name: data.purityName,
        desc: data.description,
        short_name: data.shortName,
        fine_percentage: parseFloat(data.finePercentage),
      };

      const endpoint = `${ASSETS_API}/api/company/${user?.company}/purity`;
      const method = currentPurity ? 'PUT' : 'POST';
      const url = currentPurity ? `${endpoint}/${currentPurity._id}` : endpoint;

      const response = await axios({
        method,
        url,
        data: payload,
      });

      enqueueSnackbar('Form submitted successfully!');
      reset();
      router.push(paths.dashboard.purity.list);
    } catch (error) {
      console.error('Submission error:', error);
      enqueueSnackbar('An error occurred while submitting the form', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            {currentPurity ? 'Edit Product' : 'Add New Product'}
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
              <RHFTextField name='purityName' req={'red'} label='Purity Name' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
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
              <RHFTextField name='shortName' req={'red'} label='Short Name' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='finePercentage' req={'red'} label='Fine Percentage' type='number' inputProps={{
                step: 'any',
                min: '0',
                pattern: '[0-9]*[.,]?[0-9]*',
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

PurityNewEditForm.propTypes = {
  currentPurity: PropTypes.object,
};
