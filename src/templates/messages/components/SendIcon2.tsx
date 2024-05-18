import { Box } from "@mui/material";

const SendIcon2 = ({ onClick }) => {
    return (
<Box sx={{ 
  borderRadius: '100px',
  display: 'flex',
  borderInlineColor: 'blue',
  backgroundColor: '#fbfbfb',
  width: '50px',
  height: '50px',
  justifyContent: 'center',
  alignItems: 'center',

  right: '10px',
    position: 'absolute',
    top: '-110px',
}}
onClick={onClick}
>
<Box sx={{width:'36px', height:'36px'}}>
<svg   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M270.4 929.8c-6.4 0-12.7-1.4-18.6-4.3-13.5-6.6-21.8-19.7-21.9-34.3l-0.9-157.3c-72.4-1.1-131-59-131-130V291.8c0-71.7 59.7-130 133-130h562.1c73.4 0 133 58.3 133 130v312.1c0 71.7-59.7 130-133 130H543L295.8 921.3c-7.4 5.6-16.3 8.5-25.4 8.5z m19.5-38.8z m-30.6-17.4c0 0.1 0 0.1 0 0 0 0.1 0 0.1 0 0z m-28.2-651.8c-40.3 0-73 31.4-73 70v312.1c0 38.6 32.8 70 73 70h27.8c16.5 0 29.9 13.3 30 29.8l0.8 146.9L514.8 680c5.2-4 11.6-6.1 18.1-6.1h260.2c40.3 0 73-31.4 73-70V291.8c0-38.6-32.8-70-73-70h-562z" fill="gray" /><path d="M288.3 413.6l255.3 0.2c16.6 0 30-13.4 30-30s-13.4-30-30-30l-255.3-0.2c-16.6 0-30 13.4-30 30 0 16.5 13.5 29.9 30 30zM735.7 482H288.4c-16.6 0-30 13.4-30 30s13.4 30 30 30l447.3 0.1c16.6 0 30-13.4 30-30-0.1-16.6-13.5-30-30-30.1z" fill="gray" /></svg>

        
</Box>
  </Box>
          );



}
export default SendIcon2;