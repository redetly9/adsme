import * as React from 'react';
import { Box, Input, Sheet } from "@mui/joy"
import { api } from '../../api';
import { getCurrentLocation } from '../../utils/geo';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
// import { useAppSelector } from '../../store';
import Search from './Search';


export default function SearchList() {
  const [posts, setPosts] = React.useState(null)
  // const { latitude, longitude } = useAppSelector(state => state.user.geo)
  
  const [tag, setTag] = React.useState(null)
  const getPosts = async () => {
    try {
      const response = await api.get('v2/posts/tags', {
        params: { tag },
      });
      
      setPosts(response.data.slice().reverse());
    } catch (error) {
      setPosts([]);
      console.error('Error fetching posts:', error);
    }
  };

  React.useEffect(() => {
    if (tag) {
      getPosts()
    }
  }, [tag])

  // React.useEffect(() => {
  //     getPosts()
  // }, [])

  const [typingTimeout, setTypingTimeout] = React.useState(null);

  const handleSearch = (event) => {
    const value = event.target.value;

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(setTimeout(() => {
      setTag(value);
    }, 300));
  };

  
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
                  <Box sx={{ px: 2, pb: 1.5, margin:'0 auto', marginTop: '30px', }}>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon />}
          placeholder="Search tags"
          aria-label="Search"
          onChange={handleSearch}
        />
      </Box>
      
      {/* {
  !posts ? (
    posts?.map(p => <Search post={p} key={p._id} />)
  ) : (
    <div>No Content</div>
  )
} */}

      {
        posts?.map(p => <Search post={p} key={p._id} />)
      }
      
    </Sheet>

  );
}