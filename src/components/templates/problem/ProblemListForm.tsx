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
import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { BaseInput } from '@/components/parts/common/inputs/BaseInput'
import { MultiLineInput } from '@/components/parts/common/inputs/MultiLineInput'
import { BaseRadio } from '@/components/parts/common/radios/BaseRadio'
import { fontSizes, formControlMinWidth } from '@/themes/globalStyles'
import { CreateProblemForm } from '@/types/form/CreateProblemForm'

type Props = {
  photo?: File
  setPhoto: (photo?: File) => void
}

export const ProblemListForm: FC<Props> = memo(({ photo, setPhoto }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CreateProblemForm>()
  const watchFormValue = useWatch<CreateProblemForm>({ control })

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
        break
      case !!isFileTypeError:
        return isFileTypeError
        break
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
        setIsFileTypeError(
          'Only image files supported. (extensions: png, gif, bmp, svg or jpg)',
        )
        return false
      }

      return true
    })

    if (pickedPhotos.length === 0) {
      return
    }

    // Up to 10MB
    if (pickedPhotos[0].size > 10485760) {
      setIsFileSizeError('File size is too large.')
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
            rules={{ required: '選択してください' }}
            render={({ field }) => (
              <BaseInput
                labelText="Title"
                {...field}
                errMsg={errors.title?.message}
                error={!!errors.title}
                helperText="Page number & Name of text book"
                placeholderText="The Complete Guide to the IELTS P.29"
                pxWidth="100%"
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Controller
            name="taskType"
            control={control}
            defaultValue="task1"
            render={({ field }) => (
              <BaseRadio
                radioContents={[
                  { value: 'task1', labelText: 'Type1' },
                  { value: 'task2', labelText: 'Type2' },
                ]}
                labelText="Select a type of task"
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
            render={({ field }) => (
              <MultiLineInput
                labelText="Question"
                placeholderText="This criterion assesses how appropriately,
                accurately and relevantly the response fulfils the
                requirements set out in the task, using the
                minimum of 150 words. "
                {...field}
                minRowCount={2}
                pxWidth="100%"
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
              Question Image
            </FormLabel>
          </Grid>
          <Button
            variant="outlined"
            component="label"
            startIcon={<AddPhotoAlternateOutlinedIcon />}
            sx={{ width: '70%' }}
            disabled={photo !== undefined}
          >
            Upload File
            <input
              type="file"
              name="questionImage"
              onChange={handleFile}
              hidden
              disabled={photo !== undefined}
            />
          </Button>
          <FormHelperText sx={{ marginLeft: 0, fontSize: fontSizes.xs }}>
            ※Upload a diagram image or a whole question image from textbook
          </FormHelperText>
        </FormControl>
        <br />
        {photo && (
          <>
            <IconButton onClick={() => setPhoto(undefined)} color="primary">
              <HighlightOffOutlinedIcon />
            </IconButton>
            <br />
            <img src={URL.createObjectURL(photo)} height="300px" />
          </>
        )}
      </Grid>
    </>
  )
})

ProblemListForm.displayName = 'ProblemListForm'
