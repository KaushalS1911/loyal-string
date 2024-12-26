import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function CustomerTouncheTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { customer, category, product, design, purity, sku, stoneLessPercent, template } = row;
  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding='checkbox'>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{customer?.firstName + ' ' + customer?.lastName || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{category?.name || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{product?.name || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{design?.name || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{purity?.name || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{sku?.length}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{stoneLessPercent || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{template?.templateName || '-'}</TableCell>
        <TableCell align='right' sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon='eva:more-vertical-fill' />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow='right-top'
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon='solar:trash-bin-trash-bold' />
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon='solar:pen-bold' />
          Edit
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title='Delete'
        content='Are you sure want to delete?'
        action={
          <Button variant='contained' color='error' onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

CustomerTouncheTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
