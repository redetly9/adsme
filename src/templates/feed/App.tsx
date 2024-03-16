import * as React from 'react';
import Feed from './Feed';
import { Sheet } from "@mui/joy"
import { api } from '../../api';
import { getCurrentLocation } from '../../utils/geo';
import { useAppSelector } from '../../store';


export default function FeedList() {
  const [posts, setPosts] = React.useState(null)
  const { latitude, longitude } = useAppSelector(state => state.user.geo)

  const getPosts = async () => {
    const { data } = await api.get('v2/posts', {
      params: {
        latitude,
        longitude
      }
    })

    setPosts(data.slice().reverse())
  }

  React.useEffect(() => {
    if (latitude && longitude) {
      getPosts()
    }
  }, [latitude, longitude])

  
  return (
    <Sheet
      sx={{
        pt: { xs: 'calc(12px + var(--Header-height))', md: 3 },
        pb: { xs: 2, sm: 2, md: 3 },
        flex: 1,
        minWidth: 0,
        height: 'calc(100dvh - 81.6px)',
        gap: 1,
        overflow: 'auto',
      }}
    >
      {
        posts?.map(p => <Feed post={p} key={p._id} />)
      }
      
    </Sheet>

  );
}