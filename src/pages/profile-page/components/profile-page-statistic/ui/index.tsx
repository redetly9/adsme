import './index.scss'

import { Box, CircularProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useUserStore } from '~model/user-model'
import { getTotalUserPostsViews, getUniqueUserPostsViews } from '~shared/api/user-api'

export const ProfilePageStatistic = () => {
  const { t } = useTranslation()
  const user = useUserStore(state => state.user)

  const [allViews, setAllViews] = useState(0)
  const [uniqueViews, setUniqueViews] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    (async () => {
      setIsLoading(true)
      try {
        // получение всех просмотров
        const total = await getTotalUserPostsViews(user.id)
        if ('data' in total) {
          setAllViews(total.data)
        }
        // получение уникальных просмотров
        const unique = await getUniqueUserPostsViews(user.id)
        if ('data' in unique) {
          setUniqueViews(unique.data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [user?.id])

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <Box className='ProfilePageStatistic'>
      <Typography>
        {t('Всего просмотров постов')}
        {': '}
        {allViews}
      </Typography>
      <Typography>
        {t('Уникальных просмотров постов')}
        {': '}
        {uniqueViews}
      </Typography>
    </Box>
  )
}
