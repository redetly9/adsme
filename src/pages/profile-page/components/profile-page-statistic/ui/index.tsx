import './index.scss'

import { BarChart, TrendingUp } from '@mui/icons-material'
import { Avatar, Box, CircularProgress, Typography } from '@mui/material'
import moment from 'moment'
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

  const startDate = moment().subtract(1, 'years').format('YYYY-MM-DD')
  const endDate = moment().format('YYYY-MM-DD')

  useEffect(() => {
    if (!user?.id) return

    (async () => {
      setIsLoading(true)
      try {
        // получение всех просмотров
        const total = await getTotalUserPostsViews(user.id, startDate, endDate)
        if ('data' in total) {
          setAllViews(total.data)
        }
        // получение уникальных просмотров
        const unique = await getUniqueUserPostsViews(user.id, startDate, endDate)
        if ('data' in unique) {
          setUniqueViews(unique.data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [endDate, startDate, user?.id])

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <Box className='ProfilePageStatistic'>
      <Box className='ProfilePageStatistic-row'>
        <Box className='ProfilePageStatistic-row-label'>
          <Avatar>
            <BarChart />
          </Avatar>
          <Typography>
            {t('Всего просмотров постов')}
          </Typography>
        </Box>
        <Typography>
          {allViews}
        </Typography>
      </Box>
      <Box className='ProfilePageStatistic-row'>
        <Box className='ProfilePageStatistic-row-label'>
          <Avatar>
            <TrendingUp />
          </Avatar>
          <Typography>
            {t('Всего уникальных просмотров постов')}
          </Typography>
        </Box>
        <Typography>
          {uniqueViews}
        </Typography>
      </Box>
    </Box>
  )
}
