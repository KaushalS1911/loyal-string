import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Box,
  Card, Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { useGetDailyRates, useGetPurity } from '../../api/purity';
import { ASSETS_API } from '../../config-global';
import { useAuthContext } from '../../auth/hooks';
import RHFDatePicker from '../../components/hook-form/rhf-.date-picker';

const schema = Yup.object().shape({
  dateOfBirth: Yup.date().required('Date is required'),
  rates: Yup.array().of(
    Yup.object().shape({
      todaysRate: Yup.string()
        .required('Rate is required')
        .matches(/^\d+$/, 'Must be a number'),
    }),
  ),
});

export default function PurityRateForm() {
  const { dailyRates } = useGetDailyRates();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { purity } = useGetPurity();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rates: '',
      dateOfBirth: new Date(),
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    control,
    watch,
  } = methods;

  const watchDate = watch('dateOfBirth');

  useEffect(() => {
    const fetchRatesForDate = async (date) => {
      try {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        const existingRecord = dailyRates?.find(
          (rate) => new Date(rate.date).toISOString().split('T')[0] === formattedDate,
        );

        if (existingRecord) {
          purity.forEach((item, index) => {
            const rate = existingRecord.rates[item.name] || '';
            setValue(`rates[${index}].todaysRate`, rate.toString());
          });
        } else {
          purity.forEach((_, index) => {
            setValue(`rates[${index}].todaysRate`, '');
          });
          enqueueSnackbar('No rates found for the selected date.', {
            variant: 'info',
          });
        }
      } catch (error) {
        console.error('Error fetching rates:', error);
        enqueueSnackbar('Failed to fetch rates for the selected date.', {
          variant: 'error',
        });
      }
    };

    if (watchDate) {
      fetchRatesForDate(watchDate);
    }
  }, [watchDate, dailyRates, purity, setValue, enqueueSnackbar]);

  const onSubmit = async (data) => {
    try {
      const todayDate = new Date(data.dateOfBirth).toISOString().split('T')[0];
      const existingRecord = dailyRates?.find(
        (rate) => new Date(rate.date).toISOString().split('T')[0] === todayDate,
      );

      const rates = purity.reduce((acc, item, index) => {
        const todaysRate = data.rates[index]?.todaysRate;
        if (todaysRate) {
          acc[item.name] = parseFloat(todaysRate);
        }
        return acc;
      }, {});

      const payload = {
        date: data.dateOfBirth,
        rates,
        ...(existingRecord && { _id: existingRecord._id }),
      };

      const endpoint = `${ASSETS_API}/api/company/${user?.company}/purity/daily-rates`;
      await axios.post(endpoint, payload);

      enqueueSnackbar(
        existingRecord
          ? 'Rates updated successfully!'
          : 'Rates added successfully!',
        { variant: 'success' },
      );
    } catch (error) {
      console.error('Failed to update rates:', error);
      enqueueSnackbar('Failed to update rates. Please try again.', {
        variant: 'error',
      });
    }
  };

  const handleReset = () => {
    purity.forEach((item, index) => {
      setValue(`rates[${index}].todaysRate`, '');
    });
    setValue('dateOfBirth', new Date());
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='body1' width={'150px'}>Select Date :</Typography>
              <RHFDatePicker
                name='dateOfBirth'
                control={control}
                label='Select Date'
                req='red'
              />
            </Grid>
          </Grid>
        </Box>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table sx={{ minWidth: 800 }} size='small'>
            <TableHead>
              <TableRow>
                {['Category', 'Purity', 'Short Name', 'Fine Percentage', 'Today\'s Rate'].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.secondary',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      textAlign: 'center',
                      py: 1,
                      px: 1,
                      fontSize: '0.875rem',
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {purity?.map((field, index) => (
                <TableRow key={field._id} sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' } }}>
                  <TableCell sx={{ textAlign: 'center', py: 0.5, px: 1 }}>
                    <Typography variant='body2' fontSize='0.875rem'>
                      {field.category.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', py: 0.5, px: 1 }}>
                    <Typography variant='body2' fontSize='0.875rem'>
                      {field.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', py: 0.5, px: 1 }}>
                    <Typography variant='body2' fontSize='0.875rem'>
                      {field.short_name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', py: 0.5, px: 1 }}>
                    <Typography variant='body2' fontSize='0.875rem'>
                      {field.fine_percentage}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', py: 0.5, px: 1 }}>
                    <RHFTextField
                      name={`rates[${index}].todaysRate`}
                      placeholder='Enter Rate'
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
                      sx={{
                        fontSize: '0.75rem',
                        input: { padding: '4px 8px' },
                        borderRadius: '0px',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <LoadingButton
            type='button'
            variant='outlined'
            onClick={handleReset}
            sx={{ px: 4 }}
          >
            Reset Rates
          </LoadingButton>
          <LoadingButton
            type='submit'
            variant='contained'
            loading={isSubmitting}
            sx={{ px: 4, mx: 1 }}
          >
            Submit
          </LoadingButton>
        </Box>
      </Card>
    </FormProvider>
  );
}
