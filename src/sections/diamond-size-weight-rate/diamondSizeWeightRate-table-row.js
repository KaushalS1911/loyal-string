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
import { Box, Collapse, Paper } from '@mui/material';

// ----------------------------------------------------------------------

export default function DiamondSizeWeightRateTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { templateName, items } = row;
  const confirm = useBoolean();
  const collapse = useBoolean();
  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding='checkbox'>
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{templateName}</TableCell>
      <TableCell align='right' sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon='eva:arrow-ios-downward-fill' />
        </IconButton>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon='eva:more-vertical-fill' />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout='auto'
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5, p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(11, 1fr)',
                gap: 1,
                p: 1,
                bgcolor: 'background.paper',
                fontWeight: 'bold',
                borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                textAlign: 'center',
              }}
            >
              <Box>Shape</Box>
              <Box>Clarity</Box>
              <Box>Cut</Box>
              <Box>Color</Box>
              <Box>Setting Type</Box>
              <Box>Size</Box>
              <Box>Sieve</Box>
              <Box>Weight</Box>
              <Box>Purchase Rate</Box>
              <Box>Margin</Box>
              <Box>Sell Rate</Box>
            </Box>
            {items.map((item, index) => (
              <Box
                key={item.id || index}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(11, 1fr)',
                  gap: 1,
                  p: 1,
                  textAlign: 'center',
                  '&:not(:last-of-type)': {
                    borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  },
                  bgcolor: index % 2 === 0 ? 'background.default' : 'background.paper',
                  borderRadius: 1,
                }}
              >
                <Box>{item.diamondShape}</Box>
                <Box>{item.diamondClarity}</Box>
                <Box>{item.diamondCut}</Box>
                <Box>{item.diamondColor}</Box>
                <Box>{item.diamondSettingType}</Box>
                <Box>{item.diamondSize}</Box>
                <Box>{item.sieve}</Box>
                <Box>{item.diamondWeight}</Box>
                <Box>{item.diamondPurchaseRate}</Box>
                <Box>{item.margin}</Box>
                <Box>{item.sellRate}</Box>
              </Box>
            ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
      {renderSecondary}
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

DiamondSizeWeightRateTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
