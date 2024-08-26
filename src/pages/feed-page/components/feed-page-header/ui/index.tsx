import './index.scss'

// import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import TuneIcon from '@mui/icons-material/TuneRounded'
import { Box, Button, Input } from '@mui/material'
import React, { memo } from 'react'

type FeedPageHeaderProps = {
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onButtonClick: () => void
}

export const FeedPageHeader = memo((props: FeedPageHeaderProps) => {
  const { onChangeInput, onButtonClick } = props

  return (
    <Box className='FeedPageHeader'>
      <Input
        size='small'
        className='FeedPageHeader-input'
        // startDecorator={<SearchRoundedIcon />}
        placeholder='Search'
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
