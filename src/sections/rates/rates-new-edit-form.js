import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  TableContainer,
} from '@mui/material';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { useGetPurity } from '../../api/purity';
import { ASSETS_API } from '../../config-global';
import { useAuthContext } from '../../auth/hooks';
import { useRouter } from '../../routes/hooks';
import { paths } from '../../routes/paths';

const schema = Yup.object().shape({
  rates: Yup.array().of(
    Yup.object().shape({
      todaysRate: Yup.string()
        .required('Rate is required')
        .matches(/^\d+$/, 'Must be a number'),
    }),
  ),
});

export default function PurityRateForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const router = useRouter();
  const { purity } = useGetPurity();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: { rates: '' },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const onSubmit = async (data) => {
    try {
      const payload = purity.map((item, index) => ({
        category: item.category.name,
        purity: item.name,
        fine_percentage: item.fine_percentage,
        today_rate: data.rates[index]?.todaysRate || null,
      }));

      const response = await axios.post(`${ASSETS_API}/api/company/${user?.company}/rate`, payload);

      enqueueSnackbar('Rates updated successfully!', { variant: 'success' });
      router.push(paths.dashboard.rates.list);
    } catch (error) {
      console.error('Failed to update rates:', error);
      enqueueSnackbar('Failed to update rates. Please try again.', { variant: 'error' });
    }
  };

  const handleReset = () => {
    purity.forEach((item, index) => {
      setValue(`rates[${index}].todaysRate`, '');
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table sx={{ minWidth: 800 }}>
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
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {purity?.map((field, index) => (
                <TableRow key={field._id}>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Typography variant='body2'>{field.category.name}</Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Typography variant='body2'>{field.name}</Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Typography variant='body2'>{field.short_name}</Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Typography variant='body2'>{field.fine_percentage}</Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <RHFTextField
                      name={`rates[${index}].todaysRate`}
                      placeholder='Enter Rate'
                      inputProps={{
                        min: '0',
                        pattern: '[0-9]*[.,]?[0-9]*',
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
            type='submit'
            variant='contained'
            loading={isSubmitting}
            sx={{ px: 4, mr: 2 }}
          >
            Submit
          </LoadingButton>
          <LoadingButton
            type='button'
            variant='outlined'
            onClick={handleReset}
            sx={{ px: 4 }}
          >
            Reset Rates
          </LoadingButton>
        </Box>
      </Card>
    </FormProvider>
  );
}
