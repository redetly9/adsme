import * as React from 'react';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
// import Button from '@mui/joy/Button';
// import List from '@mui/joy/List';
// import Divider from '@mui/joy/Divider';
// import ListItem from '@mui/joy/ListItem';
// import ListItemButton from '@mui/joy/ListItemButton';

export default function DrawerBasic({ open, setOpen, children }) {
  const toggleDrawer =
    (inOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpen(inOpen);
    };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor='bottom'>
        <Box
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          sx={{
            padding: '20px'
          }}
        >
          { children }
          {/* <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text) => (
              <ListItem key={text}>
                <ListItemButton>{text}</ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text) => (
              <ListItem key={text}>
                <ListItemButton>{text}</ListItemButton>
              </ListItem>
            ))}
          </List> */}
        </Box>
      </Drawer>
    </Box>
  );
}
