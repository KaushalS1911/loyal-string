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
  RHFAutocomplete, RHFSwitch,
} from 'src/components/hook-form';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { paths } from '../../routes/paths';
import { useRouter } from '../../routes/hooks';
import { useAuthContext } from '../../auth/hooks';
import axios from 'axios';
import { ASSETS_API } from '../../config-global';
import { useGetBranch } from '../../api/branch';

export default function CollectionNewEditForm({ currentCollection }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { branch } = useGetBranch();
  const router = useRouter();

  const schema = Yup.object().shape({
    collectionName: Yup.string().required('Collection Name is required'),
    branchId: Yup.object().required('Branch is required'),
  });

  const defaultValues = useMemo(
    () => ({
      collectionName: currentCollection?.name || '',
      branchId: currentCollection
        ? {
          label: currentCollection.branch.name,
          value: currentCollection.branch._id,
        }
        : null,
      description: currentCollection?.desc || '',
      slug: currentCollection?.slug || '',
    }),
    [currentCollection],
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
    const isEdit = Boolean(currentCollection?._id);
    const apiUrl = `${ASSETS_API}/api/company/${user?.company}/collection`;

    const payload = {
      branch: data.branchId.value,
      name: data.collectionName,
      desc: data.description,
      slug: data.slug,
    };

    try {
      if (isEdit) {
        await axios.put(`${apiUrl}/${currentCollection._id}`, payload);
        enqueueSnackbar('Collection updated successfully!', { variant: 'success' });
      } else {
        await axios.post(apiUrl, payload);
        enqueueSnackbar('Collection created successfully!', { variant: 'success' });
      }
      router.push(paths.dashboard.collection.list);
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Typography variant='h6' sx={{ mb: 0.5 }}>
            {currentCollection ? 'Edit Collection' : 'Add New Collection'}
          </Typography>
        </Grid>
        <Grid xs={12} md={8}>
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
              <RHFTextField name='collectionName' label='Collection Name' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
                            req={'red'}
              />
              <RHFAutocomplete
                name='branchId'
                label='Branch'
                placeholder='Select Branch'
                options={branch
                  ?.filter((e) => e.status !== false)
                  .map((e) => ({
                    label: e.name,
                    value: e._id,
                  }))}
                getOptionLabel={(option) => option.label || ''}
                fullWidth
                req={'red'}
              />
              <RHFTextField name='slug' label='Slug' onInput={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }} />
              <RHFTextField name='description' label='Description' multiline />
            </Box>
            <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ mt: 3 }}>
              <Button variant='outlined' onClick={() => reset()}>
                Reset
              </Button>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                {currentCollection ? 'Update' : 'Submit'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

CollectionNewEditForm.propTypes = {
  currentCollection: PropTypes.object,
};
