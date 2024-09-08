import { BarChart, TrendingUp } from '@mui/icons-material'
import './index.scss'

import { Avatar, Box, CircularProgress, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
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
      <List>
        <ListItem
          secondaryAction={
            <Typography>{allViews}</Typography>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <BarChart />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<Typography>
              {t('Всего просмотров постов')}
            </Typography>}
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <Typography>{uniqueViews}</Typography>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <TrendingUp />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<Typography>
              {t('Всего Уникальных просмотров постов')}
            </Typography>}
          />
        </ListItem>
      </List>
    </Box>
  )
}
