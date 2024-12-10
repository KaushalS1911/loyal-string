import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete, RHFSwitch,
} from 'src/components/hook-form';
import countrystatecity from '../../_mock/map/csc.json';
import { ASSETS_API } from '../../config-global';
import { useAuthContext } from '../../auth/hooks';
import axios from 'axios';
import { useGetUsers } from '../../api/users';
import { FormControlLabel, Switch } from '@mui/material';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';

export default function BranchNewEditForm({ currentBranch }) {
  const { enqueueSnackbar } = useSnackbar();
  const { users } = useGetUsers();
  const { user } = useAuthContext();
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const currentFinancialYear =
    currentMonth >= 3
      ? `${currentYear}-${currentYear + 1}`
      : `${currentYear - 1}-${currentYear}`;

  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = -5; i <= 5; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      years.push(`${startYear}-${endYear}`);
    }
    return years;
  }, [currentYear]);

  const NewBranchSchema = Yup.object().shape({
    branchName: Yup.string().required('Branch Name is required'),
    branchType: Yup.string().required('Branch Type is required'),
    mobileNumber: Yup.string().required('Mobile Number is required'),
    branchEmailId: Yup.string()
      .required('Branch Email ID is required')
      .email('Invalid email address'),
    street: Yup.string().required('Street is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string().required('Postal Code is required'),
  });

  const defaultValues = useMemo(
    () => ({
      branchCode: currentBranch?.branch_code || '',
      branchName: currentBranch?.name || '',
      branchType: currentBranch?.type || '',
      branchHead: currentBranch?.branch_head || '',
      mobileNumber: currentBranch?.contact || '',
      faxNumber: currentBranch?.faxNumber || '',
      branchEmailId: currentBranch?.email || '',
      financialYear: currentBranch?.financial_year || currentFinancialYear,
      gstin: currentBranch?.GST || '',
      street: currentBranch?.address?.street || '',
      country: currentBranch?.address?.country || 'India',
      state: currentBranch?.address?.state || 'Gujarat',
      city: currentBranch?.address?.city || 'Surat',
      postalCode: currentBranch?.address?.postal_code || '',
      status: currentBranch?.status || '',
    }),
    [currentBranch, currentFinancialYear],
  );

  const methods = useForm({
    resolver: yupResolver(NewBranchSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        name: data.branchName,
        type: data.branchType,
        branch_head: data.branchHead,
        GST: data.gstin,
        faxNumber: data.faxNumber,
        email: data.branchEmailId || null,
        contact: data.mobileNumber || null,
        address: {
          street: data.street,
          country: data.country,
          state: data.state,
          city: data.city,
          postal_code: data.postalCode,
        },
        financial_year: data.financialYear,
        status: data.status,
      };

      const apiUrl = currentBranch
        ? `${ASSETS_API}/api/company/${user?.company}/branch/${currentBranch._id}`
        : `${ASSETS_API}/api/company/${user?.company}/branch`;

      const response = currentBranch
        ? await axios.put(apiUrl, payload)
        : await axios.post(apiUrl, payload);

      if (response.status === 201 || response.status === 200) {
        enqueueSnackbar(
          currentBranch
            ? 'Branch updated successfully!'
            : 'Branch created successfully!',
          { variant: 'success' },
        );
        reset();
        router.push(paths.dashboard.branch.list);
      } else {
        enqueueSnackbar('Failed to save branch. Please try again.', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      enqueueSnackbar('An error occurred while saving the branch. Please try again.', {
        variant: 'error',
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display='grid'
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(4, 1fr)',
              }}
            >
              <RHFTextField name='branchCode' label='Branch Code' req={'red'} disabled />
              <RHFTextField req={'red'} name='branchName' label='Branch Name' />
              <RHFAutocomplete
                req={'red'}
                name='branchType'
                label='Branch Type'
                placeholder='Select branch type'
                options={[
                  'Headquarters',
                  'Regional Branch',
                  'Local Branch',
                  'Sales Branch',
                  'Support Branch',
                  'Retail Branch',
                  'Service Branch',
                  'Warehouse Branch',
                ]}
              />
              <RHFAutocomplete
                req={'red'}
                name='branchHead'
                label='Branch Head'
                placeholder='Select branch type'
                options={users.map((head) => head.firstName + ' ' + head.lastName)}
              />
              <RHFTextField
                name='mobileNumber'
                label='Mobile Number'
                req={'red'}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
              />
              <RHFTextField
                name='faxNumber'
                label='Fax Number'
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <RHFTextField name='branchEmailId' label='Branch Email ID' req={'red'} />
              <RHFAutocomplete
                name='financialYear'
                label='Financial Year'
                placeholder='Select Financial Year'
                options={yearOptions}
                defaultValue={currentYear}
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFTextField
                name='gstin'
                label='GSTIN'
                inputProps={{ maxLength: 15 }}
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                }}
              />
              <RHFTextField name='street' label='Street' req={'red'} />
              <RHFAutocomplete
                name='country'
                req={'red'}
                label='Country'
                placeholder='Choose a country'
                options={countrystatecity.map((country) => country.name)}
                isOptionEqualToValue={(option, value) => option === value}
                defaultValue='India'
              />
              <RHFAutocomplete
                name='state'
                req={'red'}
                label='State'
                placeholder='Choose a State'
                options={
                  watch('country')
                    ? countrystatecity
                    .find((country) => country.name === watch('country'))
                    ?.states.map((state) => state.name) || []
                    : []
                }
                defaultValue='Gujarat'
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFAutocomplete
                name='city'
                label='City'
                req={'red'}
                placeholder='Choose a City'
                options={
                  watch('state')
                    ? countrystatecity
                    .find((country) => country.name === watch('country'))
                    ?.states.find((state) => state.name === watch('state'))
                    ?.cities.map((city) => city.name) || []
                    : []
                }
                defaultValue='Surat'
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFTextField
                name='postalCode'
                label='Postal Code'
                req={'red'}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
              />
              {currentBranch && <RHFSwitch
                name='status'
                label='Status'
                sx={{ m: 0 }}
              />}
            </Box>
            <Stack alignItems='flex-end' sx={{ mt: 3 }}>
              <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
                Save Branch
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

BranchNewEditForm.propTypes = {
  currentCompany: PropTypes.object,
};
