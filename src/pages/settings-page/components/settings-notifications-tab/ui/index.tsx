import './index.scss'

import { Box, Button, Checkbox, CircularProgress, Divider, FormControlLabel, FormGroup, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useUserStore } from '~model/user-model'
import { getNotificationSettings, updateNotificationSettings } from '~shared/api'
import type { NotificationSettingsType } from '~shared/types/settings'

export const SettingsNotificationsTab = () => {
  const { t } = useTranslation()
  const user = useUserStore(state => state.user)
  /** States */
  const [newMessages, setNewMessages] = useState(false)
  const [newPosts, setNewPosts] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {
    if (!user?.id) return

    await updateNotificationSettings({
      userId: user.id.toString(),
      newUserMessages: newMessages,
      favoriteUserPosts: newPosts
    })
    searchHandler()
  }

  const searchHandler = useCallback(async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      const response = await getNotificationSettings(user.id.toString())
      if (response && 'data' in response) {
        setNotificationSettings(response.data)
        setNewPosts(response.data.favorite_user_posts)
        setNewMessages(response.data.new_user_messages)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    (async () => {
      searchHandler()
    })()
  }, [searchHandler, user?.id])

  const canSubmit = useMemo(() => {
    return newPosts === notificationSettings?.favorite_user_posts && newMessages === notificationSettings?.new_user_messages
  }, [newMessages, newPosts, notificationSettings?.favorite_user_posts, notificationSettings?.new_user_messages])

  return (
    <Box className='SettingsNotificationsTab'>
      <Box className='SettingsNotificationsTab-block'>
        <Typography
          variant='body2'
          sx={{ color: 'text.secondary' }}
        >
          {t('Пуш уведомления')}
        </Typography>
        <FormGroup>
          <FormControlLabel
            label={t('Новые сообщения от пользователей')}
            control={
              <Checkbox
                checked={newMessages}
                onChange={(_, checked) => setNewMessages(checked)}
              />
            }
          />
          <FormControlLabel
            label={t('Новые посты избранных пользователей')}
            control={
              <Checkbox
                checked={newPosts}
                onChange={(_, checked) => setNewPosts(checked)}
              />
            }
          />
        </FormGroup>
      </Box>
      <Divider sx={{ width: '100%', my: 2 }} />
      <Button
        fullWidth
        variant='outlined'
        onClick={onSubmit}
        disabled={canSubmit}
      >
        {
          isLoading ? <CircularProgress size={23} /> : t('Сохранить')
        }
      </Button>
    </Box>
  )
}
