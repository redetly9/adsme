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
                        <Link to={`profile/${id}`}>
          <Tab
            disableIndicator
            orientation="vertical"
            {...(index === 0 && { color: colors[0] })}
          >
            <ListItemDecorator>

            <Person />
            </ListItemDecorator>
            Profile
          </Tab>
          </Link>

          <Link to='/messages'>
          <Tab
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

          <Link to='/feed'>
          <Tab
            disableIndicator
            orientation="vertical"
            {...(index === 2 && { color: colors[2] })}
          >
            <ListItemDecorator>
            <HomeRoundedIcon />
            </ListItemDecorator>
            Feed
          </Tab>
          </Link>

          <Link to=''>
          <Tab
            disableIndicator
            orientation="vertical"
            {...(index === 3 && { color: colors[3] })}
          >
            <ListItemDecorator>
            <Search />
            </ListItemDecorator>
            Search
          </Tab>
          
          </Link> 
        </TabList>
      </Tabs>
    </Box>
  );
}