import './index.scss'

import TuneIcon from '@mui/icons-material/TuneRounded'
import { Box, Button, Input } from '@mui/material'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

type FeedPageHeaderProps = {
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onButtonClick: () => void
}

export const FeedPageHeader = memo((props: FeedPageHeaderProps) => {
  const { onChangeInput, onButtonClick } = props
  const { t } = useTranslation()

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
      </Button>
    </Box>
  )
})
