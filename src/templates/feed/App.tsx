import * as React from 'react';
import Feed from './Feed';
import { Box, Sheet } from "@mui/joy"
import Button from '@mui/joy/Button';
import { useAppSelector } from '../../store';
import Slider from '@mui/joy/Slider';
import { getPostsByLocation, getUserChats } from '../../hooks';
import LoadingOverlay from '../profile-dashboard/components/LoadingOverlay';
import SwipeableEdgeDrawer from './Drawer';
import TuneIcon from '@mui/icons-material/TuneRounded';

export default function FeedList() {
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [posts, setPosts] = React.useState(null)
  const [radius, setRadius] = React.useState(localStorage?.getItem('radius'))
  const { latitude, longitude } = useAppSelector(state => state.user.geo)
  console.log('posts', posts);


  const [chats, setChats] = React.useState(null);
  const getChats = async () => {
    const { data } = await getUserChats(+localStorage.user)

    setChats(data?.slice().reverse().map(c => ({ ...c, ...({ sender: c.participants?.find(p => p._id !== localStorage.user) }) })))
  }
  React.useEffect(() => {
    if (localStorage.user) {

      getChats()
    }
  }, [])

  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 100,
      label: '',
    },
    {
      value: 200,
      label: '',
    },
    {
      value: 300,
      label: '',
    },
    {
      value: 400,
      label: '',
    },
    {
      value: 500,
      label: '',
    },
    {
      value: 600,
      label: '',
    },
    {
      value: 700,
      label: '',
    },
    {
      value: 800,
      label: '',
    },
    {
      value: 900,
      label: '',
    },
    {
      value: 1000,
      label: '1000',
    },
  ];

  function valueText(value: number) {
    return `${value}`;
  }

  const getPosts = async () => {
    const { data } = await getPostsByLocation(`${longitude}`, `${latitude}`, radius || 1000,
    )
    console.log('longitude', longitude);
    console.log('latitude', latitude);

    const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    //
    const uniqueList = (ps: any[]) => {
      const ids = ps.map((p) => p.author.id) // @ts-ignore
      const uniqueIds = [...new Set(ids)]
      return uniqueIds.map((i) => ps.find((p) => p.author.id === i))
    }
    const postssss = sortedPosts ? uniqueList(sortedPosts) : []

    console.log('postssss', postssss);

    //
    setPosts(postssss);
    // setPosts(data.slice().reverse())
  }

  React.useEffect(() => {
    if (latitude && longitude) {
      getPosts()
    }
  }, [latitude, longitude, radius,])


  return (
    <Sheet
      sx={{
        pt: { xs: 'calc(12px + var(--Header-height))', md: 3 },
        pb: { xs: 2, sm: 2, md: 3 },
        flex: 1,
        minWidth: 0,
        height: 'calc(100dvh - 81.6px)',
        width: '100vw',
        gap: 1,
        overflow: 'auto',
      }}
    >

      {/* <Dropdown >
        <MenuButton sx={{
          marginLeft: 'auto', display: 'block', marginTop: '20px',
          marginRight: '20px', '&:hover': {
            borderColor: '#c7dff7',
            ' &:focus': {
              'outline': '0',
            }
          }
        }}>Filter</MenuButton>
        <Menu sx={{
          width: '100vw', border: 'none', boxShadow: 'none',
          backgroundColor: 'var(--joy-palette-background-surface)'
        }}>
          <MenuItem>  <Box sx={{ margin: '0 auto', width: 300, paddingTop: '5px', }}>
            <Slider
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              aria-label="Custom marks" //@ts-ignore
              defaultValue={radius || Number(localStorage.getItem('radius')) || 1000}
              getAriaValueText={valueText}
              max={1000}
              step={10}
              valueLabelDisplay="auto"
              marks={marks}
              onChangeCommitted={(event, newValue) => {
                setRadius(newValue);
                localStorage.setItem('radius', newValue.toString());
              }}
            />
          </Box></MenuItem>

        </Menu>
      </Dropdown> */}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<TuneIcon />}
          onClick={() => setFilterOpen(true)}
          sx={{
            '&:hover': {
              borderColor: '#c7dff7',
              ' &:focus': {
                'outline': '0',
              }
            }
          }}
        >
          Change filters
        </Button>
      </Box>

      <SwipeableEdgeDrawer open={filterOpen} setOpen={setFilterOpen}>
        <Slider
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            aria-label="Custom marks" //@ts-ignore
            defaultValue={radius || Number(localStorage.getItem('radius')) || 1000}
            getAriaValueText={valueText}
            max={1000}
            step={10}
            valueLabelDisplay="auto"
            marks={marks}
            onChangeCommitted={(event, newValue) => {
              setRadius(newValue);
              localStorage.setItem('radius', newValue.toString());
            }}
          />
      </SwipeableEdgeDrawer>



      {posts === null ? (
        <LoadingOverlay
          noFull={80}
        />
      ) : posts?.length > 0 ? (
        posts?.map(p => <Feed post={p} key={p.id} chats={chats} />)
      ) : (
        <div style={{
          marginLeft: '145px',
          marginTop: '120px'
        }}>No posts found</div>
      )}

    </Sheet>

  );
}