import Button from '@mui/joy/Button'
import type { SxProps } from '@mui/material'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

import { DrawerBasic } from '../../../../../templates/feed/Drawer.tsx'
import { ShareButtonLinks } from '../../share-button-icons'

type ShareButtonProps = {
  shareUrl: string,
  sx?: SxProps
}

export const ShareButton = ({ shareUrl, sx }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      console.log('Текст скопирован в буфер обмена!')
    }).catch(err => {
      console.error('Ошибка при копировании текста: ', err)
    })
  }

  return (
    <Box
      sx={sx}
      onClick={setIsOpen.bind(null, true)}
    >
      <span>
        Поделиться
      </span>
      <DrawerBasic
        open={isOpen}
        setOpen={setIsOpen}
        hideBackdrop={true}
        variant='outlined'
      >
        <Box sx={{ display: 'flex', overflow: 'auto', p: 1, gap: 1.5 }}>
          <ShareButtonLinks shareUrl={shareUrl} />
        </Box>
        <Box
          onClick={handleCopy}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 1, p: 2, border: '1px solid #ccc', borderRadius: 12 }}
        >
          <Typography
            variant='subtitle1'
            fontSize={16}>
            {shareUrl}
          </Typography>
          <Button variant='outlined'>
            Copy
          </Button>
        </Box>
      </DrawerBasic>
    </Box>
  )
}
