import * as React from 'react';
import Feed from './Feed';
import { Dropdown, Menu, MenuButton, MenuItem, Sheet } from "@mui/joy"
import { api } from '../../api';
import { getCurrentLocation } from '../../utils/geo';
import Box from '@mui/joy/Box';
import { useAppSelector } from '../../store';
import Slider from '@mui/joy/Slider';


export default function FeedList() {

  const [posts, setPosts] = React.useState(null)
  const [radius, setRadius] = React.useState(null)
  const { latitude, longitude } = useAppSelector(state => state.user.geo)

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
    const { data } = await api.get('v2/posts', {
      params: {
        latitude,
        longitude,
        radius,
      }
    })

    setPosts(data.slice().reverse())
  }

  React.useEffect(() => {
    if (latitude && longitude) {
      getPosts()
    }
  }, [latitude, longitude, radius])


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

      <Dropdown >
        <MenuButton sx={{ marginLeft: 'auto', display: 'block', marginTop: '20px',
         marginRight: '20px',    '&:hover': {
          borderColor: '#c7dff7',
         ' &:focus': {
            'outline': '0',
        }
        } }}>Filter</MenuButton>
        <Menu sx={{
          width: '100vw', border: 'none', boxShadow: 'none',
          backgroundColor: 'var(--joy-palette-background-surface)'
        }}>
          <MenuItem>  <Box sx={{ margin: '0 auto', width: 300, paddingTop: '5px', }}>
          <Slider
  aria-label="Custom marks"
  defaultValue={radius || Number(sessionStorage.getItem('radius')) || 20}
  getAriaValueText={valueText}
  max={1000}
  step={10}
  valueLabelDisplay="auto"
  marks={marks}
  onChangeCommitted={(event, newValue) => {
    setRadius(newValue);
    sessionStorage.setItem('radius', newValue.toString());
  }}
/>
          </Box></MenuItem>

        </Menu>
      </Dropdown>


      {
        posts?.map(p => <Feed post={p} key={p._id} />)
      }

    </Sheet>

  );
}