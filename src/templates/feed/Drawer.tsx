import Box from '@mui/joy/Box'
import Drawer from '@mui/joy/Drawer'

export default function DrawerBasic({ open, setOpen, children }) {

  const toggleDrawer = (inOpen: boolean) => (e: any) => {
    e.stopPropagation()
    setOpen(inOpen)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor='bottom'>
        <Box
          role='presentation'
          sx={{ padding: '20px' }}
        >
          {children}
        </Box>
      </Drawer>
    </Box>
  )
}
