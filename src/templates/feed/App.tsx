import * as React from 'react';
import Feed from './Feed';
import { Sheet } from "@mui/joy"


export default function FeedList() {

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
            <Feed/>
            <Feed/>
            <Feed/>
            <Feed/>
        </Sheet>
    
  );
}