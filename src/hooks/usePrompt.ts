/**
 * These hooks re-implement the now removed useBlocker and usePrompt hooks in 'react-router-dom'.
 * Thanks for the idea @piecyk https://github.com/remix-run/react-router/issues/8139#issuecomment-953816315
 * Source: https://github.com/remix-run/react-router/commit/256cad70d3fd4500b1abcfea66f3ee622fb90874#diff-b60f1a2d4276b2a605c05e19816634111de2e8a4186fe9dd7de8e344b65ed4d3L344-L381
 */
import { useContext, useEffect, useCallback } from 'react'
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom'

import { History, Transition } from 'history'

import { useDispatch } from 'react-redux'
import { commonSlice } from '@/store/common'
import { useTranslation } from 'react-i18next'

type ExtendNavigator = Navigator & Pick<History, 'block'>
/**
 * Blocks all navigation attempts. This is useful for preventing the page from
 * changing until some condition is met, like saving form data.
 *
 * @param  blocker
 * @param  when
 * @see https://reactrouter.com/api/useBlocker
 */
export function useBlocker(blocker: (tx: Transition) => void, when = true) {
  const { navigator } = useContext(NavigationContext)

  useEffect(() => {
    if (!when) return

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const unblock = (navigator as any as ExtendNavigator).block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          // Automatically unblock the transition so it can play all the way
          // through before retrying it. TODO: Figure out how to re-enable
          // this block if the transition is cancelled for some reason.
          unblock()
          tx.retry()
        },
      }

      blocker(autoUnblockingTx)
    })

    return unblock
  }, [navigator, blocker, when])
}

/**
 * Prompts the user with an Alert before they leave the current screen.
 *
 * @param  message
 * @param  when
 */
export function usePrompt(onSave: () => void, when = true) {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const blocker = useCallback((tx: Transition) => {
    // on button on the dialog clicked
    const onAction = (result: boolean | undefined) => {
      // on click backdrop of the dialog
      if (result === undefined) {
        return
      }
      // if choose cancel, destroy changes and move page
      if (!result) {
        return tx.retry()
      } else {
        onSave()
      }
    }
    dispatch(
      commonSlice.actions.updateDialog({
        isDialogShow: true,
        titleText: t('Answer.form.unsavedDialogTitle'),
        cancelText: t('Answer.form.unsavedDialogWithoutSavingButton'),
        actionText: t('Answer.form.unsavedDialogSavingButton'),
        onAction,
      }),
    )
  }, [])

  useBlocker(blocker, when)
}
