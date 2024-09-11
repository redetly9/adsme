import './index.scss'

import { BarChart, TrendingUp } from '@mui/icons-material'
import { Avatar, Box, Button, CircularProgress, Typography } from '@mui/material'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useUserStore } from '~model/user-model'
import { ProfilePageTimeRangeModal } from '~pages/profile-page/components/profile-page-time-range-modal'
import { getTotalUserPostsViews, getUniqueUserPostsViews } from '~shared/api/user-api'

const defaultTimeFormat = 'YYYY-MM-DD'

export const ProfilePageStatistic = () => {
  const { t } = useTranslation()
  const user = useUserStore(state => state.user)

  const [allViews, setAllViews] = useState(0)
  const [uniqueViews, setUniqueViews] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [startDate, setStartDate] = useState<moment.Moment | null>(null)
  const [endDate, setEndDate] = useState<moment.Moment | null>(null)

  useEffect(() => {
    if (!user?.id) return

    (async () => {
      try {
        setIsLoading(true)
        const formatedDateStart = startDate ?? moment().subtract(1, 'years')
        const formatedDateEnd = endDate ?? moment()

        // получение всех просмотров
        const total = await getTotalUserPostsViews(user.id, formatedDateStart.format(defaultTimeFormat), formatedDateEnd.format(defaultTimeFormat))
        if ('data' in total) {
          setAllViews(total.data)
        }
        // получение уникальных просмотров
        const unique = await getUniqueUserPostsViews(user.id, formatedDateStart.format(defaultTimeFormat), formatedDateEnd.format(defaultTimeFormat))
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

  const handleDateChange = useCallback((dates: [(moment.Moment | null), (moment.Moment | null)]) => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)
  }, [])

  return (
    <>
      <Box className='ProfilePageStatistic-header'>
        <Typography
          variant='body1'
          sx={{ color: 'text.secondary' }}
        >
          {t('Статистика')}
        </Typography>
        <Button onClick={setIsModalOpen.bind(null, true)}>
          {
            startDate !== null && endDate !== null
              ? `${startDate.format(defaultTimeFormat)} - ${endDate.format(defaultTimeFormat)}`
              : t('Выбрать время')
          }
        </Button>
      </Box>
      {
        isLoading
          ? <CircularProgress />
          : (
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
      {/** Блок с модальным окном */}
      <ProfilePageTimeRangeModal
        isModalOpen={isModalOpen}
        closeModal={setIsModalOpen.bind(null, false)}
        startDate={startDate}
        endDate={endDate}
        handleDateChange={handleDateChange}
      />
    </>
  )
}
