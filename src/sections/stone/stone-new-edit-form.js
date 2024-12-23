import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';
import axios from 'axios';
import { useAuthContext } from '../../auth/hooks';
import { ASSETS_API } from '../../config-global';

export default function StoneNewEditForm({ currentStone }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user } = useAuthContext();

  const schema = Yup.object().shape({
    stoneName: Yup.string().required('Stone Name is required'),
    stoneLessPercent: Yup.string()
      .required('Stone Less Percent is required')
      .min(0, 'Value must be greater than or equal to 0')
      .max(100, 'Value must be less than or equal to 100'),
    stoneWeight: Yup.string()
      .required('Stone Weight is required')
      .min(0, 'Value must be greater than or equal to 0'),
    stonePieces: Yup.string()
      .required('Stone Pieces is required')
      .min(0, 'Value must be greater than or equal to 0'),
    stoneRate: Yup.string()
      .min(0, 'Value must be greater than or equal to 0')
      .nullable(true),
  });

  const defaultValues = useMemo(() => ({
    stoneName: currentStone ? currentStone.name : '',
    stoneLessPercent: currentStone ? currentStone.lessPercent : '',
    stoneWeight: currentStone ? currentStone.stoneWeight : '',
    stonePieces: currentStone ? 1 : 1,
    stoneRate: currentStone ? currentStone.stoneRate : '',
    stoneAmount: currentStone ? currentStone.stoneAmount : '',
    description: currentStone ? currentStone.desc : '',
  }), [currentStone]);

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

  const stoneWeight = watch('stoneWeight');
  const stoneRate = watch('stoneRate');

  useEffect(() => {
    if (stoneWeight && stoneRate) {
      setValue('stoneAmount', stoneWeight * stoneRate);
    }
  }, [stoneWeight, stoneRate, setValue]);

  const onSubmit = async (data) => {
    try {
      const url = `${ASSETS_API}/api/company/${user?.company}/stone`;

      const payload = {
        name: data.stoneName,
        lessPercent: data.stoneLessPercent,
        stoneWeight: data.stoneWeight,
        stonePieces: data.stonePieces,
        stoneRate: data.stoneRate,
        stoneAmount: data.stoneAmount,
        desc: data.description,
      };

      let response;

      if (currentStone) {
        response = await axios.put(`${url}/${currentStone._id}`, payload);
        enqueueSnackbar('Stone updated successfully!');
      } else {
        response = await axios.post(url, payload);
        enqueueSnackbar('Stone added successfully!');
      }

      router.push(paths.dashboard.stone.list);
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      enqueueSnackbar('Error occurred while submitting', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            {currentStone ? 'Edit Stone' : 'Add New Stone'}
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
              <RHFTextField name='stoneName' label='Stone Name' req={'red'} onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='stoneLessPercent' label='Stone Less Percent' type='number' req={'red'} inputProps={{
                step: 'any',
                min: '0',
                pattern: '[0-9]*[.,]?[0-9]*',
              }} />
              <RHFTextField name='stoneWeight' label='Stone Weight' type='number' req={'red'} inputProps={{
                step: 'any',
                min: '0',
                pattern: '[0-9]*[.,]?[0-9]*',
              }} />
              <RHFTextField name='stonePieces' label='Stone Pieces' type='number' value={1} disabled={true}
                            inputProps={{
                              shrink: true,
                            }} />
              <RHFTextField name='stoneRate' label='Stone Rate' type='number' inputProps={{
                step: 'any',
                min: '0',
                pattern: '[0-9]*[.,]?[0-9]*',
              }} />
              <RHFTextField name='stoneAmount' label='Stone Amount' type='number' inputProps={{
                step: 'any',
                min: '0',
                pattern: '[0-9]*[.,]?[0-9]*',
                shrink: true,
              }} />
              <RHFTextField name='description' label='Description' multiline rows={2} />
            </Box>
            <Stack direction='row' justifyContent='flex-end' spacing={2} sx={{ mt: 3 }}>
              <Button variant='outlined' onClick={() => reset()}>
                Reset
              </Button>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                {currentStone ? 'Update' : 'Submit'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

StoneNewEditForm.propTypes = {
  currentStone: PropTypes.object,
};
