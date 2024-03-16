import * as React from 'react';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';
import AspectRatio from '@mui/joy/AspectRatio';
import Divider from '@mui/joy/Divider';
import Avatar from '@mui/joy/Avatar';
import Tooltip from '@mui/joy/Tooltip';

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ForwardToInboxRoundedIcon from '@mui/icons-material/ForwardToInboxRounded';
import FolderIcon from '@mui/icons-material/Folder';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

export default function Feed({ post: any }) {
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

  return (
    <Sheet
      variant="outlined"
      sx={{
        minHeight: 500,
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
            src="https://i.pravatar.cc/40?img=3"
            srcSet="https://i.pravatar.cc/80?img=3"
          />
          <Box sx={{ ml: 2 }}>
            <Typography level="title-sm" textColor="text.primary" mb={0.5}>
              Alex Jonnold
            </Typography>
            <Typography level="body-xs" textColor="text.tertiary">
              21 Oct 2022
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
              src="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36"
              srcSet="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&h=160 2x"
              alt="Yosemite National Park"
              style={{ minWidth: '100%', transform: '' }}
            />
        </Card>
      </Box>

      <Divider />
      <Typography level="body-sm" mt={2} mb={2}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae voluptatibus, libero obcaecati voluptatum cumque in voluptate tenetur magni, eum ipsam beatae laboriosam commodi quis alias deserunt mollitia veritatis veniam, a aperiam! Voluptate animi quae rem, laboriosam deserunt illo repudiandae libero voluptatum dolore omnis esse alias repellendus veniam ullam debitis! Repellat?
      </Typography>


    </Sheet>
  );
}