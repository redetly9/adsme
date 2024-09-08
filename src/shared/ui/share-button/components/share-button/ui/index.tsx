import type { SxProps } from '@mui/material'
import { Box, Button } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DrawerBasic } from '~shared/ui/drawer-basic'

import { ShareButtonLinks } from '../../share-button-icons'

type ShareButtonProps = {
  shareUrl: string,
  sx?: SxProps,
  className?: string
}

export const ShareButton = ({ shareUrl, sx, className }: ShareButtonProps) => {
  const { t } = useTranslation()
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
      className={className}
    >
      <span>
        {t('Поделиться')}
      </span>
      <DrawerBasic
        open={isOpen}
        setOpen={setIsOpen}
        hideBackdrop={true}
      >
        <Box sx={{ display: 'flex', p: 1, gap: 1.9, flexWrap: 'wrap' }}>
          <ShareButtonLinks shareUrl={shareUrl} />
        </Box>
        <Box
          onClick={handleCopy}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            mt: 1,
            p: 2,
            border: '1px solid #ccc',
            borderRadius: 4
          }}
        >
          <Typography
            variant='subtitle1'
            fontSize={16}
            fontWeight='bold'
          >
            {shareUrl}
          </Typography>
          <Button variant='outlined'>
            {t('Копировать')}
          </Button>
        </Box>
      </DrawerBasic>
    </Box>
  )
}
