import './index.scss'

import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useUserStore } from '~model/user-model'
import { getNotificationSettings } from '~shared/api'

export const SettingsNotificationsTab = () => {
  const { t } = useTranslation()
  const user = useUserStore(state => state.user)
  /** States */
  const [isNewMessages, setIsNewMessages] = useState(false)
  const [isNewPosts, setIsNewPosts] = useState(false)

  const onSubmit = () => {

  }

  useEffect(() => {
    (async () => {
      if (user?.id) {
        try {
          const response = await getNotificationSettings(user.id.toString())
          console.log('response', response)
        } catch (err) {
          console.error(err)
        }
      }
    })()
  }, [user?.id])

  // const canSubmit = useMemo(() => deepEqual(initialValues, values), [values])

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
                checked={isNewMessages}
                onChange={(_, checked) => setIsNewMessages(checked)}
              />
            }
          />
          <FormControlLabel
            label={t('Новые посты избранных пользователей')}
            control={
              <Checkbox
                checked={isNewPosts}
                onChange={(_, checked) => setIsNewPosts(checked)}
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
        // disabled={canSubmit}
      >
        {t('Сохранить')}
      </Button>
    </Box>
  )
}
