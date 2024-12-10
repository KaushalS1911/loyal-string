import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import { borderRadius } from '@mui/system';

// ----------------------------------------------------------------------

export default function RHFTextField({ name, helperText, type, req, ...other }) {
  const { control } = useFormContext();
  const customStyle = req ? { borderLeft: `2px solid ${req}`} : {};

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:focus-within': {
                borderRadius: 0,
              },
            },
            '&:not(:focus-within) label ~ .MuiOutlinedInput-root': {
              borderRadius: 0,
              ...customStyle,
            },
            '& label': {
              marginTop: -0.8,
              fontSize: '14px',
            },
            '& .MuiInputLabel-shrink': {
              marginTop: 0,
            },
            '& input': {
              height: '7px',
            },
          }}
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            if (type === 'number') {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}

RHFTextField.propTypes = {
  helperText: PropTypes.object,
  name: PropTypes.string,
  type: PropTypes.string,
};
