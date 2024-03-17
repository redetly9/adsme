import * as React from 'react';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';
import Divider from '@mui/joy/Divider';
import Avatar from '@mui/joy/Avatar';

import ForwardToInboxRoundedIcon from '@mui/icons-material/ForwardToInboxRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import moment from 'moment'
import { useNavigate } from 'react-router-dom';


export default function Search({ post }) {
  const [open, setOpen] = React.useState([false, false, false]);

  const handleSnackbarOpen = (index: number) => {
    const updatedOpen = [...open];
    updatedOpen[index] = true;
    setOpen(updatedOpen);
  };

  const handleSnackbarClose = (index: number) => {
    const updatedOpen = [...open];
    updatedOpen[index] = false;
    setOpen(updatedOpen);
  };
  const navigate = useNavigate();
  return (
    <Sheet
      variant="outlined"
      sx={{
        borderRadius: 'sm',
        p: 2,
        mb: 3,
      }}
    >
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
          <Avatar
            src={post?.author?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4JYrktZNYfJ7k1QFk-hL3v6J9fiTAvsZeWRTybV0hSv_-wwPli_IJBB16Y8Tepi5U0Qg&usqp=CAU'}
            onClick={() => {if(post?.author?._id) {
              navigate(`/profile/${post?.author?._id}`)
            }}}
          />
          <Box sx={{ ml: 2 }}>
            <Typography level="title-sm" textColor="text.primary" mb={0.5}>
            {post?.author?.surname}{' '}
            {post?.author?.name}{' '}
            {post?.author?.lastname}

            {
              !post?.author?.surname && !post?.author?.name && !post?.author?.lastname && 'User'
            }
            </Typography>
            <Typography level="body-xs" textColor="text.tertiary">
              { moment(post.createdAt).fromNow() }
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
            onClick={() => handleSnackbarOpen(0)}
          >
            Reply
          </Button>
          <Snackbar
            color="success"
            open={open[0]}
            onClose={() => handleSnackbarClose(0)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            startDecorator={<CheckCircleRoundedIcon />}
            endDecorator={
              <Button
                onClick={() => handleSnackbarClose(0)}
                size="sm"
                variant="soft"
                color="neutral"
              >
                Dismiss
              </Button>
            }
          >
            Your message has been sent.
          </Snackbar>
          <Button
            size="sm"
            variant="plain"
            color="neutral"
            startDecorator={<ForwardToInboxRoundedIcon />}
            onClick={() => handleSnackbarOpen(1)}
          >
            Forward
          </Button>
          <Snackbar
            color="success"
            open={open[1]}
            onClose={() => handleSnackbarClose(1)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            startDecorator={<CheckCircleRoundedIcon />}
            endDecorator={
              <Button
                onClick={() => handleSnackbarClose(1)}
                size="sm"
                variant="soft"
                color="neutral"
              >
                Dismiss
              </Button>
            }
          >
            Your message has been forwarded.
          </Snackbar>
          <Snackbar
            color="danger"
            open={open[2]}
            onClose={() => handleSnackbarClose(2)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            startDecorator={<CheckCircleRoundedIcon />}
            endDecorator={
              <Button
                onClick={() => handleSnackbarClose(2)}
                size="sm"
                variant="soft"
                color="neutral"
              >
                Dismiss
              </Button>
            }
          >
            Your message has been deleted.
          </Snackbar>
        </Box>
      </Box>
      <Divider sx={{ mt: 2 }} />
      <Divider />
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          '& > div': {
            boxShadow: 'none',
            '--Card-padding': '0px',
            '--Card-radius': theme.vars.radius.sm,
          },
        })}
      >
        <Card variant="outlined" sx={{ minWidth: '100%' }}>
            <img
              src={post.images?.[0]}
              alt="Yosemite National Park"
              style={{ minWidth: '100%', maxWidth: '100%' }}
            />
        </Card>
      </Box>

      <Divider />
      <Typography level="body-sm" mt={2} mb={2}>
        {
          post.title
        }
      </Typography>


    </Sheet>
  );
}