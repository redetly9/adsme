import * as React from 'react';
import { Box, Input, Sheet, Skeleton } from "@mui/joy";
import { api } from '../../api';
// import { getCurrentLocation } from '../../utils/geo';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Search from './Search';




import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';


import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';


import { useAppSelector } from '../../store';

export default function SearchList() {
  const [posts, setPosts] = React.useState(null);
  const [tag, setTag] = React.useState('');
  const { latitude, longitude } = useAppSelector(state => state.user.geo);
  console.log(posts);

  const [chats, setChats] = React.useState<any>(null);
  const getChats = async () => {
    const { data } = await api.get(`v2/chats/${sessionStorage.user}`)
    setChats(data.slice().reverse().map(c => ({ ...c, ...({ sender: c.participants?.find(p => p._id !== sessionStorage.user) }) })))
  }
  React.useEffect(() => {
    if (sessionStorage.user) {
      getChats()
    }
  }, [])
  console.log('chats', chats);
  
  const getPostsByTag = async () => {
    try {
      const response = await api.get('v2/posts/tags', {
        params: { tag },
      });
      setPosts(response.data.slice().reverse());
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(error.response.data.message);
        setPosts([]);
      } else {
        console.error('Error fetching posts by tag:', error);
      }
    }
  };

  const getAllPosts = async () => {
    try {
      const response = await api.get('v2/posts', {
        params: {
          latitude,
          longitude,
          radius: sessionStorage.getItem('radius') || '20'
        }
      });
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching all posts:', error);
    }
  };

  React.useEffect(() => {
    if (tag) {
      getPostsByTag();
    } else if (latitude & longitude) {
      getAllPosts();
    }
  }, [tag, latitude, longitude]);

  const [typingTimeout, setTypingTimeout] = React.useState(null);

  const handleSearch = (event) => {
    const value = event.target.value.trim();

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(setTimeout(() => {
      setTag(value);
    }, 300));
  };

  return (
    <Sheet sx={{
        pt: { xs: 'calc(12px + var(--Header-height))', md: 3 },
        pb: { xs: 2, sm: 2, md: 3 },
        flex: 1,
        minWidth: 0,
        height: 'calc(100vh - 81.6px)',
        width: '100vw',
        gap: 1,
        overflow: 'auto',
      }}
    >
      <Box sx={{ px: 2, pb: 1.5, margin:'0 auto', marginTop: '30px', }}>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon />}
          placeholder="Search tags"
          aria-label="Search"
          onChange={handleSearch}
        />
      </Box>

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
        posts.map(p =>  <Search post={p} key={p._id} chats={chats} />)
      ) : (
        <div style={{marginLeft: '145px',
          marginTop: '120px'}}>No posts found</div>
      )}
    </Sheet>
  );
}
