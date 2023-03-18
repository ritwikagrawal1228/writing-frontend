import React, { FC, memo, useState } from 'react'

import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { BaseInput } from '@/components/parts/common/inputs/BaseInput'
import { MultiLineInput } from '@/components/parts/common/inputs/MultiLineInput'
import { BaseRadio } from '@/components/parts/common/radios/BaseRadio'
import { fontSizes, formControlMinWidth } from '@/themes/globalStyles'
import { CreateProblemForm } from '@/types/form/CreateProblemForm'

type Props = {
  photo?: File | string
  setPhoto: (photo?: File) => void
}

export const ProblemListForm: FC<Props> = memo(({ photo, setPhoto }) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<CreateProblemForm>()
  const { t } = useTranslation()
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
        setIsFileTypeError(t('Problem.form.fileTypeError') as string)
        return false
      }

      return true
    })

    if (pickedPhotos.length === 0) {
      return
    }

    // Up to 10MB
    if (pickedPhotos[0].size > 10485760) {
      setIsFileSizeError(t('Problem.form.fileSizeError') as string)
      return
    }

    setPhoto(pickedPhotos[0])
  }

  return (
    <>
      <Grid container item columnSpacing={5} sx={{ width: '100%' }}>
        <Grid item xs={6}>
          <Controller
            name="title"
            control={control}
            rules={{ required: t('Problem.form.required') as string }}
            defaultValue=""
            render={({ field }) => (
              <BaseInput
                labelText={t('Problem.form.title') as string}
                {...field}
                errMsg={errors.title?.message}
                error={!!errors.title}
                helperText={t('Problem.form.titleHelper') as string}
                placeholderText={t('Problem.form.titlePlaceHolder') as string}
                pxWidth="100%"
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="taskType"
            control={control}
            defaultValue="Type_#Task1"
            render={({ field }) => (
              <BaseRadio
                radioContents={[
                  { value: 'Type_#Task1', labelText: 'Type1' },
                  { value: 'Type_#Task2', labelText: 'Type2' },
                ]}
                labelText={t('Problem.form.taskType') as string}
                width="m"
                {...field}
              />
            )}
          />
        </Grid>
      </Grid>
      <br />
      <Grid container sx={{ width: '100%' }}>
        <Grid item xs={12}>
          <Controller
            name="question"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <MultiLineInput
                labelText={t('Problem.form.question') as string}
                placeholderText={
                  t('Problem.form.questionPlaceHolder') as string
                }
                {...field}
                minRowCount={2}
                pxWidth="100%"
              />
            )}
          />
        </Grid>
      </Grid>
      <br />
      {watch('taskType') === 'Type_#Task1' && (
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
                {t('Problem.form.questionImage')}
              </FormLabel>
            </Grid>
            <Button
              variant="contained"
              color="secondary"
              component="label"
              startIcon={<AddPhotoAlternateOutlinedIcon />}
              sx={{ width: '70%' }}
              disabled={photo !== undefined}
            >
              {t('Problem.form.imageUploadButton')}
              <input
                type="file"
                name="questionImage"
                onChange={handleFile}
                hidden
                disabled={photo !== undefined}
              />
            </Button>
            <FormHelperText sx={{ marginLeft: 0, fontSize: fontSizes.xs }}>
              {t('Problem.form.imageHelper1')}
              <br />
              <span style={{ color: 'red' }}>
                {t('Problem.form.imageHelper2')}
              </span>
            </FormHelperText>
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
      )}
    </>
  )
})

ProblemListForm.displayName = 'ProblemListForm'
