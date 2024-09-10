import './index.scss'

import TuneIcon from '@mui/icons-material/TuneRounded'
import { Box, Button, Input, Typography } from '@mui/material'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { useUserStore } from '~model/user-model'

type FeedPageHeaderProps = {
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onButtonClick: () => void
}

export const FeedPageHeader = memo(({ onChangeInput, onButtonClick }: FeedPageHeaderProps) => {
  const { t } = useTranslation()
  const user = useUserStore(state => state.userRadius)

  return (
    <Box className='FeedPageHeader'>
      <Input
        size='small'
        className='FeedPageHeader-input'
        placeholder={t('Поиск')}
        aria-label='Search'
        onChange={onChangeInput}
      />
      <Button
        variant='outlined'
        color='inherit'
        onClick={onButtonClick}
      >
        <TuneIcon />
        <Typography
          variant='body2'
          sx={{ color: 'text.secondary' }}
        >
          {user.valueOf()}
        </Typography>
      </Button>
    </Box>
  )
})
