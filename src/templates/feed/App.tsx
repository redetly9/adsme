import * as React from 'react';
import Feed from './Feed';
import { Dropdown, Menu, MenuButton, MenuItem, Sheet, Skeleton } from "@mui/joy"
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import { api } from '../../api';
import { getCurrentLocation } from '../../utils/geo';
import Box from '@mui/joy/Box';
import { useAppSelector } from '../../store';
import Slider from '@mui/joy/Slider';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';

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
    const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setPosts(sortedPosts);
    // setPosts(data.slice().reverse())
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


      {posts === null ? (
           <Box>
            <Sheet
           variant="outlined"
           sx={{
             borderRadius: 'sm',
             border:"none",
             p: 2,
             mb: 3,
           }}>
           <Box
             sx={{
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               flexWrap: 'wrap',
               gap: 2,
             }}
           >
             <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
             <Skeleton variant="circular" width={40} height={40} />
               <Box sx={{ ml: 2 }}>
                 <Typography level="title-sm" textColor="text.primary" mb={0.5}>
                 <Skeleton animation="wave" variant="text" sx={{ width: 60, borderRadius:'5px' }} />
                 </Typography>
                 <Typography level="body-xs" textColor="text.tertiary">
                 <Skeleton animation="wave" variant="text" sx={{ width: 70, borderRadius:'5px' }} />
                 </Typography>
               </Box>
             </Box>
             <Box
               sx={{ display: 'flex', height: '32px', flexDirection: 'row', gap: 1.5 }}
             >
               <Button
                 size="sm"
                 variant="plain"
                 color="neutral"
                 startDecorator={<ReplyRoundedIcon />}
               >
              <Skeleton animation="wave" variant="text" sx={{ width: 35, borderRadius:'5px' }} />
               </Button>
             </Box>
           </Box>

           <Box
             sx={{marginTop:'15px'}}
           >
<Box sx={{ width: '100%', height: '238px', position: 'relative' }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{ width: '100%', height: '100%',borderRadius:'5px'  }}
      />
    </Box>
           </Box>
           <Divider />
           <Typography level="body-sm" mt={2} mb={2}>
             {<Skeleton animation="wave" variant="text" sx={{ width: '100%', borderRadius:'5px' }} />}
           </Typography>
     <Box sx={{display:'flex', gap:'5px', flexWrap:'wrap'}}>
     <Skeleton animation="wave" variant="text" sx={{ width: 50, borderRadius:'99px' }} />
     <Skeleton animation="wave" variant="text" sx={{ width: 50, borderRadius:'99px' }} />
     </Box>
         </Sheet>


         <Sheet
           variant="outlined"
           sx={{
             borderRadius: 'sm',
             border:"none",
             p: 2,
             mb: 3,
           }}>
           <Box
             sx={{
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               flexWrap: 'wrap',
               gap: 2,
             }}
           >
             <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
             <Skeleton variant="circular" width={40} height={40} />
               <Box sx={{ ml: 2 }}>
                 <Typography level="title-sm" textColor="text.primary" mb={0.5}>
                 <Skeleton animation="wave" variant="text" sx={{ width: 60, borderRadius:'5px' }} />
                 </Typography>
                 <Typography level="body-xs" textColor="text.tertiary">
                 <Skeleton animation="wave" variant="text" sx={{ width: 70, borderRadius:'5px' }} />
                 </Typography>
               </Box>
             </Box>
             <Box
               sx={{ display: 'flex', height: '32px', flexDirection: 'row', gap: 1.5 }}
             >
               <Button
                 size="sm"
                 variant="plain"
                 color="neutral"
                 startDecorator={<ReplyRoundedIcon />}
                 
               >
                                  <Skeleton animation="wave" variant="text" sx={{ width: 35, borderRadius:'5px' }} />
               </Button>
             </Box>
           </Box>

           <Box
             sx={{marginTop:'15px'}}
           >
<Box sx={{ width: '100%', height: '238px', position: 'relative' }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{ width: '100%', height: '100%',borderRadius:'5px'  }}
      />

    </Box>
           </Box>
     
           <Divider />
           <Typography level="body-sm" mt={2} mb={2}>
             {
                 <Skeleton animation="wave" variant="text" sx={{ width: '100%', borderRadius:'5px' }} />
             }
           </Typography>
     <Box sx={{display:'flex', gap:'5px', flexWrap:'wrap'}}>
     <Skeleton animation="wave" variant="text" sx={{ width: 50, borderRadius:'99px' }} />
     <Skeleton animation="wave" variant="text" sx={{ width: 50, borderRadius:'99px' }} />
     </Box>
         </Sheet>
         <Sheet
           variant="outlined"
           sx={{
             borderRadius: 'sm',
             border:"none",
             p: 2,
             mb: 3,
           }}>
           <Box
             sx={{
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               flexWrap: 'wrap',
               gap: 2,
             }}
           >
             <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
             <Skeleton variant="circular" width={40} height={40} />
               <Box sx={{ ml: 2 }}>
                 <Typography level="title-sm" textColor="text.primary" mb={0.5}>
                 <Skeleton animation="wave" variant="text" sx={{ width: 60, borderRadius:'5px' }} />
                 </Typography>
                 <Typography level="body-xs" textColor="text.tertiary">
                 <Skeleton animation="wave" variant="text" sx={{ width: 70, borderRadius:'5px' }} />
                 </Typography>
               </Box>
             </Box>
             <Box
               sx={{ display: 'flex', height: '32px', flexDirection: 'row', gap: 1.5 }}
             >
               <Button
                 size="sm"
                 variant="plain"
                 color="neutral"
                 startDecorator={<ReplyRoundedIcon />}
                 
               >
                                  <Skeleton animation="wave" variant="text" sx={{ width: 35, borderRadius:'5px' }} />
               </Button>
             </Box>
           </Box>

           <Box
             sx={{marginTop:'15px'}}
           >
<Box sx={{ width: '100%', height: '238px', position: 'relative' }}>
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{ width: '100%', height: '100%',borderRadius:'5px'  }}
      />

    </Box>
           </Box>
     
           <Divider />
           <Typography level="body-sm" mt={2} mb={2}>
             {
                 <Skeleton animation="wave" variant="text" sx={{ width: '100%', borderRadius:'5px' }} />
             }
           </Typography>
     <Box sx={{display:'flex', gap:'5px', flexWrap:'wrap'}}>
     <Skeleton animation="wave" variant="text" sx={{ width: 50, borderRadius:'99px' }} />
     <Skeleton animation="wave" variant="text" sx={{ width: 50, borderRadius:'99px' }} />
     </Box>
         </Sheet>
           </Box>
         
      ) : posts.length > 0 ? (
        posts.map(p => <Feed post={p} key={p._id} />)
      ) : (
        <div style={{marginLeft: '145px',
          marginTop: '120px'}}>No posts found</div>
      )}

    </Sheet>

  );
}