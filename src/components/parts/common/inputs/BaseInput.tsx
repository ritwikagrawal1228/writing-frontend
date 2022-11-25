import React, { ChangeEvent, forwardRef, useEffect, useState } from 'react'

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  OutlinedInput,
} from '@mui/material'

import {
  fontSizes,
  formControlMinWidth,
  inputHeight,
} from '@/themes/globalStyles'
import { BaseInputProps } from '@/types/props/inputs/BaseInputProps'

export const BaseInput = React.memo(
  forwardRef((props: BaseInputProps, ref) => {
    const {
      value,
      disabled = false,
      error = false,
      required = false,
      errMsg = '',
      onChange,
      labelText,
      helperText = '',
      pxWidth,
      width = 'm',
      placeholderText = '',
      type = 'text',
      height = inputHeight.default,
      startAdornment = <></>,
      endAdornment = <></>,
      onFocus,
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
          onFocus={onFocus}
          value={inputValue}
          disabled={disabled}
          error={error}
          onChange={handleChange}
          placeholder={placeholderText}
          sx={{ height }}
          inputProps={{
            sx: {
              py: '0px',
            },
          }}
          ref={ref}
          type={type}
          startAdornment={startAdornment}
          endAdornment={endAdornment}
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

BaseInput.displayName = 'BaseInput'
