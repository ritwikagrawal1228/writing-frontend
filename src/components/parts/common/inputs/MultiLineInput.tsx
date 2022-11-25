import React, {
  ChangeEvent,
  FC,
  forwardRef,
  memo,
  useEffect,
  useState,
} from 'react'

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  OutlinedInput,
} from '@mui/material'

import { fontSizes, formControlMinWidth } from '@/themes/globalStyles'
import { MultiLineInputProps } from '@/types/props/inputs/MultiLineInputProps'

export const MultiLineInput: FC<MultiLineInputProps> = memo(
  forwardRef((props, ref) => {
    const {
      value,
      disabled = false,
      error = false,
      required = false,
      errMsg = '',
      onChange,
      labelText,
      helperText = '',
      width = 'm',
      pxWidth,
      placeholderText = '',
      minRowCount,
    } = props

    const [inputValue, setInputValue] = useState<string | number>(value)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const newVal = event.target.value
      onChange(newVal)
      setInputValue(newVal)
    }

    useEffect(() => {
      setInputValue(value)
    }, [value])

    return (
      <FormControl
        sx={{ minWidth: pxWidth ? pxWidth : formControlMinWidth[width] }}
      >
        <Grid>
          <FormLabel
            focused={false}
            sx={{
              fontSize: fontSizes.s,
              fontWeight: 'bold',
              position: 'relative',
            }}
          >
            {labelText}
          </FormLabel>
        </Grid>
        {error && (
          <FormHelperText sx={{ marginLeft: 0 }} error={error}>
            {errMsg}
          </FormHelperText>
        )}
        <OutlinedInput
          value={inputValue}
          disabled={disabled}
          error={error}
          onChange={handleChange}
          required={required}
          placeholder={placeholderText}
          multiline
          minRows={minRowCount}
          ref={ref}
        />
        {helperText && (
          <FormHelperText sx={{ marginLeft: 0, fontSize: fontSizes.xs }}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    )
  }),
)

MultiLineInput.displayName = 'MultiLineInput'
