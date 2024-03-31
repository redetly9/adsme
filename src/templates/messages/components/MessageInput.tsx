import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import { IconButton, Stack } from '@mui/joy';

import SendRoundedIcon from '@mui/icons-material/SendRounded';

export type MessageInputProps = {
  textAreaValue: string;
  setTextAreaValue: (value: string) => void;
  onSubmit: () => void;
};

export default function MessageInput(props: MessageInputProps) {
  const { textAreaValue, setTextAreaValue, onSubmit } = props;
  const textAreaRef = React.useRef<HTMLDivElement>(null);
  const handleClick = () => {
    if (textAreaValue.trim() !== '') {
      onSubmit(textAreaValue);
      setTextAreaValue('');
    }
  };
  return (
    <Box sx={{ 
      px: 2,
     pb: 2,
     position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 1000, 
      }}>
      {/* <FormControl>
        <Textarea
          placeholder="Type something here…"
          aria-label="Message"
          ref={textAreaRef}
          onChange={(e) => {
            setTextAreaValue(e.target.value);
          }}
          value={textAreaValue}
          minRows={1}
          maxRows={4}
          endDecorator={
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexGrow={1}
              sx={{
                py: 1,
                pr: 1,
                // borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <div>
              </div>
              <Button
                size="sm"
                color="primary"
                sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                endDecorator={<SendRoundedIcon />}
                onClick={handleClick}
              >
                Send
              </Button>
            </Stack>
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              handleClick();
            }
          }}
          sx={{
            '& textarea:first-of-type': {
              minHeight: 12,
            },
          }}
        />
      </FormControl> */}
<Box sx={{display:'flex', alignItems:'flex-end'}}>
<Textarea
          ref={textAreaRef}
          minRows={1}
          maxRows={4}
          value={textAreaValue}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              handleClick();
            }
          }}
          onChange={(e) => {
            setTextAreaValue(e.target.value);
          }}
          placeholder="Type something here…"
  sx={{width:'100%'}}
  
/>
<Button 
sx={{maxHeight:'36px'}}
onClick={handleClick} >Send</Button>
</Box>
    </Box>
  );
}