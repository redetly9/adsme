import './index.scss'

import InsertChartIcon from '@mui/icons-material/InsertChart'
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useUserStore } from '~model/user-model'
import { createInvoice, getTariffs } from '~shared/api'
import type { TariffsType } from '~shared/types/tariffs'
import { DrawerBasic } from '~shared/ui/drawer-basic'
import { LoadingOverlay } from '~shared/ui/loading-overlay'
import { PageHeader } from '~shared/ui/page-header'

export const TariffsPage = () => {
  const { t } = useTranslation()
  const user = useUserStore(state => state.user)
  /** States */
  const [isYourFeedVisible, setIsYourFeedVisible] = useState(false)
  const [isStatisticVisible, setIsStatisticVisible] = useState(false)
  const [isChatVisible, setIsChatVisible] = useState(false)
  const [tariffs, setTariffs] = useState<TariffsType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    (async () => {
      const response = await getTariffs()
      if (response && 'data' in response) {
        setTariffs(response.data)
      }
    })()
  }, [])

  const onPriceButtonClick = async (id: number) => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      const { data } = await createInvoice({
        userId: user.id,
        tariffId: id
      })
      window.location.href = data.confirmation.confirmation_url
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box className='SubscribePlansPage'>
      {isLoading ? <LoadingOverlay /> : null}
      <PageHeader
        title={t('План подписок')}
        withRightSideAction={false}
      />
      <Box className='SubscribePlansPage-content'>
        {/**
         * Main Card
         */}
        <Card sx={{ width: '95%' }}>
          <CardContent>
            <Typography
              variant='h4'
              component='div'
            >
              {t('Выберите подписку, которая подходит вам')}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 1.5 }}>
              {t('Что дает подписка и почему она вам нужна')}
            </Typography>
            <List>
              <ListItem>
                <ListItemButton onClick={() => setIsYourFeedVisible(true)}>
                  <ListItemIcon>
                    <VisibilityIcon color='primary' />
                  </ListItemIcon>
                  <ListItemText primary={t('Доступ к вашей ленте для других пользователей')} />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton onClick={() => setIsStatisticVisible(true)}>
                  <ListItemIcon>
                    <InsertChartIcon color='success' />
                  </ListItemIcon>
                  <ListItemText primary={t('Статистика просмотров ваших постов')} />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton onClick={() => setIsChatVisible(true)}>
                  <ListItemIcon>
                    <MarkChatReadIcon color='warning' />
                  </ListItemIcon>
                  <ListItemText primary={t('Участие в общем чате')} />
                </ListItemButton>
              </ListItem>
            </List>
          </CardContent>
        </Card>
        {/**
         * Cards with price
         */}
        {
          tariffs.length > 0
            ? tariffs.map(({ id, name, price }) => (
              <Card
                key={id}
                sx={{ width: '80%' }}
              >
                <CardContent>
                  <Typography
                    variant='h6'
                    component='div'
                  >
                    {t(name)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    size='small'
                    variant='contained'
                    color='success'
                    onClick={() => onPriceButtonClick(id)}
                  >
                    {t('Купить по')}
                    {' '}
                    {price}
                    ₽
                  </Button>
                </CardActions>
              </Card>
            ))
            : null
        }
      </Box>
      {/**
       * Drawers
       */}
      <DrawerBasic
        open={isYourFeedVisible}
        setOpen={setIsYourFeedVisible}
        hideBackdrop={false}
      >
        <Typography
          variant='h5'
          component='div'
        >
          <VisibilityIcon
            fontSize='large'
            color='primary'
            sx={{ mr: 1, mb: 0.4 }}
          />
          {t('Ваши посты становятся видимы другим, что позволяет расширить круг общения и делиться моментами с более широкой аудиторией.')}
        </Typography>
      </DrawerBasic>
      <DrawerBasic
        open={isStatisticVisible}
        setOpen={setIsStatisticVisible}
        hideBackdrop={false}
      >
        <Typography
          variant='h5'
          component='div'
        >
          <InsertChartIcon
            fontSize='large'
            color='success'
            sx={{ mr: 1, mb: 0.4 }}
          />
          {t('Вы сможете видеть, сколько людей просматривают ваши публикации, что поможет вам лучше понимать вашу аудиторию и повышать популярность своих постов.')}
        </Typography>
      </DrawerBasic>
      <DrawerBasic
        open={isChatVisible}
        setOpen={setIsChatVisible}
        hideBackdrop={false}
      >
        <Typography
          variant='h5'
          component='div'
        >
          <MarkChatReadIcon
            fontSize='large'
            color='warning'
            sx={{ mr: 1, mb: 0.4 }}
          />
          {t('Присоединяйтесь к живым обсуждениям с другими пользователями, делитесь впечатлениями, новостями и узнавайте первыми о том, что происходит вокруг.')}
        </Typography>
      </DrawerBasic>
    </Box>
  )
}
