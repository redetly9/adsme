import * as React from 'react';
import { Box, Input, Sheet } from "@mui/joy";
import { api } from '../../api';
// import { getCurrentLocation } from '../../utils/geo';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Search from './Search';
import { useAppSelector } from '../../store';

export default function SearchList() {
  const [posts, setPosts] = React.useState(null);
  const [tag, setTag] = React.useState('');
  const { latitude, longitude } = useAppSelector(state => state.user.geo);
  
  const getPostsByTag = async () => {
    try {
      const response = await api.get('v2/posts/tags', {
        params: { tag },
      });
      setPosts(response.data.slice().reverse());
    } catch (error) {
      console.error('Error fetching posts by tag:', error);
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
    } else {
      getAllPosts();
    }
  }, [tag, latitude, longitude]);

  const handleSearch = (event) => {
    setTag(event.target.value.trim());
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
        <div>Loading...</div>
      ) : posts.length > 0 ? (
        posts.map(p => <Search post={p} key={p._id} />)
      ) : (
        <div>No posts found</div>
      )}
    </Sheet>
  );
}
