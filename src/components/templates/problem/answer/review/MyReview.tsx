import React, { FC, memo, useState } from 'react'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'

import { ProfileAvatar } from '@/components/parts/common/ProfileAvatar'
import { reviewService } from '@/services/reviewService'
import { RootState } from '@/store'
import { commonSlice } from '@/store/common'
import { fontSizes } from '@/themes/globalStyles'
import { Review } from '@/types/model/review'

type Props = {
  answerId: string
  reviews: Review[]
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>
}

export const MyReview: FC<Props> = memo(({ reviews, setReviews, answerId }) => {
  const { t } = useTranslation()
  const amplifyUser = useSelector((state: RootState) => state.user.amplifyUser)
  const user = useSelector((state: RootState) => state.user.user)
  const theme = useTheme()
  const [myReviewValue, setMyReviewValue] = useState<string>('')
  const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null)
  const dispatch = useDispatch()

  const saveOwnReview = () => {
    if (isEdit) {
      editOwnReview()
      return
    }
    reviewService
      .createReview(answerId, myReviewValue, amplifyUser)
      .then(({ createReview }) => {
        const rs = [...reviews]
        rs.push(createReview)
        setReviews(rs)
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: t('Answer.review.reviewSavedSuccessSnackbar'),
            snackBarType: 'success',
          }),
        )
      })
      .catch(() => {
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: t('Answer.review.reviewSavedFailedSnackbar'),
            snackBarType: 'error',
          }),
        )
      })
  }

  const editOwnReview = () => {
    reviewService
      .updateReview(
        reviews.find((review) => review.userId === user?.id)?.id || '',
        myReviewValue,
        amplifyUser,
      )
      .then(() => {
        const rs = [...reviews]
        const r = rs.map((r) => {
          if (r.userId === user?.id) {
            r.content = myReviewValue
          }
          return r
        })
        setReviews(r)
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: t('Answer.review.reviewEditedSuccessSnackbar'),
            snackBarType: 'success',
          }),
        )
      })
      .catch(() => {
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: t('Answer.review.reviewEditedFailedSnackbar'),
            snackBarType: 'error',
          }),
        )
      })
      .finally(() => {
        setIsEdit(false)
      })
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMenu(event.currentTarget)
  }
  const handleCloseUserMenu = (menu: string) => {
    switch (menu) {
      case 'edit':
        setIsEdit(true)
        setMyReviewValue(
          reviews.find((review) => review.userId === user?.id)?.content || '',
        )
        break
      case 'delete':
        confirmDelete()
        break
      default:
        break
    }

    setAnchorElMenu(null)
  }

  const confirmDelete = () => {
    setIsAlertOpen(true)
  }

  const handleAlertClose = () => {
    setIsAlertOpen(false)
  }

  const deleteReview = () => {
    handleAlertClose()
    dispatch(commonSlice.actions.updateIsBackdropShow(true))
    reviewService
      .deleteReview(
        reviews.find((review) => review.userId === user?.id)?.id || '',
        amplifyUser,
      )
      .then(() => {
        const rs = [...reviews]
        rs.splice(
          rs.findIndex((review) => review.userId === user?.id),
          1,
        )
        setReviews(rs)
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: t('Answer.review.reviewDeletedSuccessSnackbar'),
            snackBarType: 'success',
          }),
        )
      })
      .catch(() => {
        dispatch(
          commonSlice.actions.updateSnackBar({
            isSnackbarShow: true,
            snackBarMsg: t('Answer.review.reviewDeletedFailedSnackbar'),
            snackBarType: 'error',
          }),
        )
      })
      .finally(() => dispatch(commonSlice.actions.updateIsBackdropShow(false)))
  }

  return (
    <>
      {reviews.find((review) => review.userId === user?.id) && !isEdit ? (
        <Box sx={{ display: 'flex' }}>
          <ProfileAvatar user={user} />
          <Box
            sx={{
              backgroundColor: `${theme.palette.primary.main}14`,
              ml: 2,
              borderRadius: 4,
              padding: 2,
            }}
          >
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
              {reviews.find((review) => review.userId === user?.id)?.content}
            </Typography>
          </Box>
          <Tooltip title="Open menu">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElMenu}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElMenu)}
            onClose={handleCloseUserMenu}
          >
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <ListItemButton onClick={() => handleCloseUserMenu('edit')}>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('Answer.review.tabContentMyReviewEditButton')}
                />
              </ListItemButton>
              <ListItemButton onClick={() => handleCloseUserMenu('delete')}>
                <ListItemIcon>
                  <DeleteForeverIcon />
                </ListItemIcon>
                <ListItemText
                  primary={t('Answer.review.tabContentMyReviewDeleteButton')}
                />
              </ListItemButton>
            </List>
          </Menu>
          <Dialog
            open={isAlertOpen}
            onClose={handleAlertClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {t('Answer.review.tabContentMyReviewDeleteDialogTitle')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t('Answer.review.tabContentMyReviewDeleteDialogDescription')}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="inherit" onClick={handleAlertClose}>
                {t('Answer.review.tabContentMyReviewDeleteDialogCancelButton')}
              </Button>
              <Button
                onClick={() => deleteReview()}
                variant="contained"
                autoFocus
              >
                {t('Answer.review.tabContentMyReviewDeleteDialogDeleteButton')}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        <>
          <TextField
            inputProps={{ style: { fontSize: fontSizes.m } }}
            color="secondary"
            fullWidth
            multiline
            rows={5}
            value={myReviewValue}
            onChange={(e) => setMyReviewValue(e.target.value)}
            placeholder={
              t('Answer.review.tabContentMyReviewInputPlaceholder') || ''
            }
          />
          <Button color="secondary" variant="contained" onClick={saveOwnReview}>
            {t('Answer.review.tabContentMyReviewInputSaveButton')}
          </Button>
          {isEdit && (
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => setIsEdit(false)}
            >
              {t('Answer.review.tabContentMyReviewInputCancelEditButton')}
            </Button>
          )}
        </>
      )}
    </>
  )
})

MyReview.displayName = 'MyReview'
