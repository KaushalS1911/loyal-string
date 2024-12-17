import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { fDate } from '../../utils/format-time';

// ----------------------------------------------------------------------

export default function RatesTableRow({ row, selected }) {
  const { name, category, fine_percentage, today_rate, updatedAt } = row;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDate(updatedAt) || '-'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{category?.name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fine_percentage}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{today_rate}</TableCell>
      </TableRow>
    </>
  );
}

RatesTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
