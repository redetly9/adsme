import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Textarea from '@mui/joy/Textarea';
import SendIcon from './SendIcon';


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
      p: 2,
    width: '100%',
    zIndex: 1000, 
      }}>
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
          placeholder="Сообщение"
  sx={{width:'100%'}}
  
/>
{/* <Button 
sx={{maxHeight:'36px'}}
onClick={handleClick} >Send</Button> */}
{textAreaValue ? (<SendIcon onClick={handleClick}/>): ('')}
</Box>
    </Box>
  );
}