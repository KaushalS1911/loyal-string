import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { fDate } from '../../utils/format-time';

// ----------------------------------------------------------------------

export default function DevicesTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { deviceType, deviceCode, activationDate, deactivationDate, contact, status } = row;
  const confirm = useBoolean();
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding='checkbox'>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{deviceType || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{deviceCode || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(activationDate) || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(deactivationDate) || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{contact || '-'}</TableCell>
        <TableCell>
          <Label
            variant='soft'
            color={
              (status === 'Active' && 'success') ||
              (status === 'Inactive' && 'error') ||
              'default'
            }
          >
            {status || '-'}
          </Label>
        </TableCell>
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

DevicesTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
