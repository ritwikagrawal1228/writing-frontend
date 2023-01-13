import React, { FC, memo, useState } from 'react'

import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import { Controller, useFormContext } from 'react-hook-form'

import { BaseInput } from '@/components/parts/common/inputs/BaseInput'
import { MultiLineInput } from '@/components/parts/common/inputs/MultiLineInput'
import { fontSizes, formControlMinWidth } from '@/themes/globalStyles'
import { UpdateProfileSettingForm } from '@/types/form/ProfileSettingForm'

type Props = {
  photo?: File | string
  setPhoto: (photo?: File) => void
  locale?: string
}

export const ProfileSettingForm: FC<Props> = memo(
  ({ photo, setPhoto, locale = 'en' }) => {
    const {
      control,
      formState: { errors },
    } = useFormContext<UpdateProfileSettingForm>()

    const t = useTranslations('Problem')
    const [isFileTypeError, setIsFileTypeError] = useState<string>('')
    const [isFileSizeError, setIsFileSizeError] = useState<string>('')

    const resetErrors = () => {
      setIsFileTypeError('')
      setIsFileSizeError('')
    }

    const showError = () => {
      switch (true) {
        case !!isFileSizeError:
          return isFileSizeError
        case !!isFileTypeError:
          return isFileTypeError
        default:
          return ''
          break
      }
    }

    const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files === null || event.target.files.length === 0) {
        return
      }
      const files = Object.values(event.target.files).concat()
      event.target.value = ''
      resetErrors()

      const pickedPhotos = files.filter((file) => {
        if (
          ![
            'image/gif',
            'image/jpeg',
            'image/png',
            'image/bmp',
            'image/svg+xml',
          ].includes(file.type)
        ) {
          setIsFileTypeError(t('form.fileTypeError'))
          return false
        }

        return true
      })

      if (pickedPhotos.length === 0) {
        return
      }

      // Up to 10MB
      if (pickedPhotos[0].size > 10485760) {
        setIsFileSizeError(t('form.fileSizeError'))
        return
      }

      setPhoto(pickedPhotos[0])
    }

    return (
      <>
        <Grid container item columnSpacing={2} sx={{ width: '100%' }}>
          <Grid item xs={6}>
            <Controller
              name="name"
              control={control}
              rules={{ required: t('form.required') }}
              defaultValue=""
              render={({ field }) => (
                <BaseInput
                  labelText="Name"
                  {...field}
                  errMsg={errors.name?.message}
                  error={!!errors.name}
                  helperText=""
                  placeholderText=""
                  pxWidth="100%"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="email"
              control={control}
              rules={{ required: t('form.required') }}
              defaultValue=""
              render={({ field }) => (
                <BaseInput
                  labelText="Email"
                  {...field}
                  errMsg={errors.email?.message}
                  error={!!errors.email}
                  helperText=""
                  placeholderText=""
                  pxWidth="100%"
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container sx={{ width: '100%' }} columnSpacing={2}>
          <Grid item xs={6}>
            <Controller
              name="introduction"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <MultiLineInput
                  labelText="Introduction"
                  placeholderText=""
                  {...field}
                  minRowCount={3}
                  pxWidth="100%"
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="studyTarget"
              control={control}
              render={({ field }) => (
                <BaseInput
                  labelText="Target Score"
                  {...field}
                  errMsg={errors.studyTarget?.message}
                  error={!!errors.studyTarget}
                  helperText=""
                  placeholderText=""
                  pxWidth="100%"
                  type="number"
                />
              )}
            />
          </Grid>
        </Grid>
        <br />
        <Grid item xs={5}>
          {(isFileSizeError || isFileTypeError) && (
            <Alert severity="error">{showError()}</Alert>
          )}
          <FormControl sx={{ minWidth: formControlMinWidth['m'] }}>
            <Grid>
              <FormLabel
                focused={false}
                sx={{
                  fontSize: fontSizes.s,
                  fontWeight: 'bold',
                  position: 'relative',
                }}
              >
                Profile image
              </FormLabel>
            </Grid>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateOutlinedIcon />}
              sx={{ width: '70%' }}
              disabled={photo !== undefined}
            >
              {t('form.imageUploadButton')}
              <input
                type="file"
                name="questionImage"
                onChange={handleFile}
                hidden
                disabled={photo}
              />
            </Button>
          </FormControl>
          <br />
          {photo && (
            <>
              <IconButton onClick={() => setPhoto(undefined)} color="primary">
                <HighlightOffOutlinedIcon />
              </IconButton>
              <br />
              <img
                src={
                  typeof photo === 'string' ? photo : URL.createObjectURL(photo)
                }
                height="300px"
              />
            </>
          )}
        </Grid>
      </>
    )
  },
)

ProfileSettingForm.displayName = 'ProfileSettingForm'
