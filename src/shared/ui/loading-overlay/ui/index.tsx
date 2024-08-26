import { Box, CircularProgress } from '@mui/material'

export const LoadingOverlay = ({ noFull }: { noFull?: number }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: noFull ? `${noFull}%` : '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
      }}
    >
      <CircularProgress />
    </Box>
  )
}
