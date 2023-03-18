import React, { FC, forwardRef, memo, useEffect, useState } from 'react'

import {
  FormControl,
  FormControlLabel,
  formControlLabelClasses,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  svgIconClasses,
} from '@mui/material'

import { colors, fontSizes, formControlMinWidth } from '@/themes/globalStyles'
import { RadioProps } from '@/types/props/radios/RadioProps'

export const BaseRadio: FC<RadioProps> = memo(
  forwardRef((props, ref) => {
    const {
      value,
      radioContents,
      onChange,
      labelText,
      helperText = '',
      width = 'm',
      disabled = false,
    } = props

    const [selectValue, setSelectValue] = useState<string | number | boolean>(
      value,
    )

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = (event.target as HTMLInputElement).value

      if (newVal === 'true') {
        onChange(true)
        setSelectValue(true)
        return
      }

      if (newVal === 'false') {
        onChange(false)
        setSelectValue(false)
        return
      }

      onChange(newVal)
      setSelectValue(newVal)
    }

    useEffect(() => {
      setSelectValue(value)
    }, [value])

    return (
      <FormControl sx={{ minWidth: formControlMinWidth[width] }}>
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
        <RadioGroup row onChange={handleRadioChange} value={selectValue}>
          {radioContents.map((radio, i) => (
            <FormControlLabel
              ref={ref}
              value={radio.value}
              key={`${i.toString()}-label`}
              disabled={disabled}
              control={
                <Radio
                  sx={{
                    [`& .${svgIconClasses.root}`]: {
                      fontSize: fontSizes.xl,
                    },
                    color: colors.base.lightGray,
                  }}
                />
              }
              label={radio.labelText}
              sx={{
                [`& .${formControlLabelClasses.label}`]: {
                  fontSize: fontSizes.s,
                },
              }}
            />
          ))}
        </RadioGroup>
        {helperText && (
          <FormHelperText sx={{ marginLeft: 0, fontSize: fontSizes.xs }}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    )
  }),
)

BaseRadio.displayName = 'BaseRadio'
