import * as Yup from 'yup';
import { useMemo, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import axios from 'axios';
import { ASSETS_API } from '../../config-global';
import Typography from '@mui/material/Typography';
import { useAuthContext } from '../../auth/hooks';
import IconButton from '@mui/material/IconButton';
import Iconify from '../../components/iconify';
import { useGetDiamondAttributes } from '../../api/diamond-attributes';
import { Tooltip } from '@mui/material';

export default function AddDiamondAttributes() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { diamondAttributes, mutate } = useGetDiamondAttributes();
  const [selectedTab, setSelectedTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        diamondValue: Yup.string().required('Diamond Value is required'),
        diamondAttribute: Yup.string().required('Diamond Attribute is required'),
      }),
    []
  );

  const defaultValues = useMemo(
    () => ({
      diamondValue: '',
      diamondAttribute: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const { handleSubmit, formState: { isSubmitting, errors }, reset } = methods;

  const onSubmit = useCallback(
    async (data) => {
      try {
        const payload = {
          diamondValue: data.diamondValue,
          diamondAttribute: data.diamondAttribute,
        };

        await axios.post(
          `${ASSETS_API}/api/company/${user?.company}/diamond-attributes`,
          payload,
          { headers: { 'Content-Type': 'application/json' } },
        );

        mutate();
        enqueueSnackbar('Diamond attributes updated successfully!', { variant: 'success' });
        reset(defaultValues);
      } catch (error) {
        console.error('Error updating diamond attributes:', error);
        enqueueSnackbar('Failed to update diamond attributes.', { variant: 'error' });
      }
    },
    [user?.company, enqueueSnackbar, reset, defaultValues]
  );

  const handleDelete = useCallback(
    async (attributeId) => {
      try {
        await axios.delete(
          `${ASSETS_API}/api/company/${user?.company}/diamond-attributes`,
          {
            headers: { 'Content-Type': 'application/json' },
            data: { ids: [attributeId] },
          }
        );
        mutate();
        enqueueSnackbar('Diamond attribute deleted successfully!', { variant: 'success' });
      } catch (error) {
        console.error('Error deleting diamond attribute:', error);
        enqueueSnackbar('Failed to delete diamond attribute.', { variant: 'error' });
      }
    },
    [user?.company, enqueueSnackbar]
  );

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPage(0);
  };

  const filteredAttributes = useMemo(() => {
    const attributes = ['color', 'cut', 'clarity', 'carat', 'shape'];
    if (selectedTab === 0) return diamondAttributes;
    return diamondAttributes?.filter(attr => attr.diamondAttribute === attributes[selectedTab - 1]);
  }, [selectedTab, diamondAttributes]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Add Diamond Attribute
            </Typography>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <RHFAutocomplete
                  name="diamondAttribute"
                  label="Select Diamond Attribute"
                  options={['color', 'cut', 'clarity', 'carat', 'shape']}
                  required
                  error={!!errors.diamondAttribute}
                  helperText={errors.diamondAttribute?.message}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <RHFTextField
                  name="diamondValue"
                  label="Diamond Value"
                  required
                  error={!!errors.diamondValue}
                  onInput={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                  helperText={errors.diamondValue?.message}
                />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Submit
              </LoadingButton>
            </Box>
          </Card>
        </Grid>
        <Grid xs={12}>
          <Card sx={{ p: 2 }}>
            <Tabs value={selectedTab} onChange={handleTabChange} centered>
              <Tab label="All" />
              <Tab label="Color" />
              <Tab label="Cut" />
              <Tab label="Clarity" />
              <Tab label="Carat" />
              <Tab label="Shape" />
            </Tabs>
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f4f4f4', fontSize: '0.875rem', padding: '8px' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f4f4f4', fontSize: '0.875rem', padding: '8px' }}>Attribute</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f4f4f4', fontSize: '0.875rem', padding: '8px' }}>Value</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f4f4f4', fontSize: '0.875rem', padding: '8px' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAttributes
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((attr, index) => (
                      <TableRow
                        key={attr._id}
                        sx={{
                          '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                          '&:hover': { backgroundColor: '#f0f0f0' },
                        }}
                      >
                        <TableCell sx={{ padding: '8px' }}>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell sx={{ padding: '8px' }}>{attr.diamondAttribute}</TableCell>
                        <TableCell sx={{ padding: '8px' }}>{attr.diamondValue}</TableCell>
                        <TableCell align="right" sx={{ padding: '8px' }}>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleDelete(attr._id)}>
                              <Iconify icon="material-symbols:delete" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredAttributes?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ color: '#999', padding: '16px' }}>
                        No attributes found for this category.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredAttributes?.length || 0}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
