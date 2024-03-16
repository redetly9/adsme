import * as React from 'react';
import Box from '@mui/joy/Box';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import Search from '@mui/icons-material/Search';
import Person from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import { MessageRounded } from '@mui/icons-material';

export default function NavBar() {
  const [index, setIndex] = React.useState(1);
  const id = sessionStorage.user
  const colors = ['primary', 'primary', 'primary', 'primary'] as const;
  return (
    <Box>
      <Tabs
        size="lg"
        aria-label="Bottom Navigation"
        value={index}
        onChange={(event, value) => setIndex(value as number)}
        sx={(theme) => ({
          p: 1,
          borderRadius: 16,
          maxWidth: 400,
          mx: 'auto',
          boxShadow: theme.shadow.sm,
          '--joy-shadowChannel': theme.vars.palette[colors[0]].darkChannel,
          [`& .${tabClasses.root}`]: {
            py: 1,
            flex: 1,
            transition: '0.3s',
            fontWeight: 'md',
            fontSize: 'md',
            [`&:not(.${tabClasses.selected}):not(:hover)`]: {
              opacity: 0.7,
            },
          },
        })}
      >
        <TabList
          variant="plain"
          size="sm"
          disableUnderline
          sx={{ borderRadius: 'lg', p: 0 }}
        >

          <Link style={{ width: '25%', maxWidth: '25%' }} to='/'>
            <Tab
              sx={{ width: '100%' }}
              disableIndicator
              orientation="vertical"
            >
              <ListItemDecorator>
                <HomeRoundedIcon />
              </ListItemDecorator>
              Feed
            </Tab>
          </Link>

          <Link style={{ width: '25%', maxWidth: '25%' }} to='/messages'>
            <Tab
              sx={{ width: '100%' }}
              disableIndicator
              orientation="vertical"
              {...(index === 1 && { color: colors[1] })}
            >
              <ListItemDecorator>

                <MessageRounded />

              </ListItemDecorator>
              Messages
            </Tab>
          </Link>

          <Link style={{ width: '25%', maxWidth: '25%' }} to='/'>
            <Tab
              sx={{ width: '100%' }}
              disableIndicator
              orientation="vertical"
            >
              <ListItemDecorator>
                <Search />
              </ListItemDecorator>
              Search
            </Tab>
          </Link>

          <Link style={{ width: '25%', maxWidth: '25%' }} to={`/profile/${id}`}>
            <Tab
              sx={{ width: '100%' }}
              disableIndicator
              orientation="vertical"
            >
              <ListItemDecorator>

                <Person />
              </ListItemDecorator>
              Profile
            </Tab>
          </Link>

        </TabList>
      </Tabs>
    </Box>
  );
}