import React, { FC, memo, useState } from 'react'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Box,
  Button,
  CircularProgress,
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
import { useSelector, useDispatch } from 'react-redux'

import { ProfileAvatar } from '@/components/parts/common/ProfileAvatar'
import { reviewService } from '@/services/reviewService'
import { RootState } from '@/store'
import { commonSlice } from '@/store/common'
import { fontSizes } from '@/themes/globalStyles'
import { Review } from '@/types/model/review'

type Props = {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  answerId: string
  reviews: Review[]
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>
}

export const MyReview: FC<Props> = memo(
  ({ reviews, setReviews, isLoading, setIsLoading, answerId }) => {
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
      setIsLoading(true)
      reviewService
        .createReview(answerId, myReviewValue)
        .then(({ data }) => {
          const rs = [...reviews]
          rs.push(data.createReview)
          setReviews(rs)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    const editOwnReview = () => {
      setIsLoading(true)
      reviewService
        .updateReview(
          reviews.find((review) => review.userId === user?.id)?.id || '',
          myReviewValue,
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
        })
        .finally(() => {
          setIsEdit(false)
          setIsLoading(false)
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
              snackBarMsg: 'Your review has been deleted',
              snackBarType: 'success',
            }),
          )
        })
        .catch(() => {
          dispatch(
            commonSlice.actions.updateSnackBar({
              isSnackbarShow: true,
              snackBarMsg: 'Failed to delete your review',
              snackBarType: 'error',
            }),
          )
        })
        .finally(() =>
          dispatch(commonSlice.actions.updateIsBackdropShow(false)),
        )
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
                  <ListItemText primary="Edit" />
                </ListItemButton>
                <ListItemButton onClick={() => handleCloseUserMenu('delete')}>
                  <ListItemIcon>
                    <DeleteForeverIcon />
                  </ListItemIcon>
                  <ListItemText primary="Delete" />
                </ListItemButton>
              </List>
            </Menu>
            <Dialog
              open={isAlertOpen}
              onClose={handleAlertClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this review?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button color="inherit" onClick={handleAlertClose}>
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteReview()}
                  variant="contained"
                  autoFocus
                >
                  Yes, Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        ) : isLoading ? (
          <CircularProgress />
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
              placeholder="You can write feedback on your own answer."
            />
            <Button
              color="secondary"
              variant="contained"
              onClick={saveOwnReview}
            >
              Save
            </Button>
            {isEdit && (
              <Button
                color="inherit"
                variant="contained"
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </Button>
            )}
          </>
        )}
      </>
    )
  },
)

MyReview.displayName = 'MyReview'
