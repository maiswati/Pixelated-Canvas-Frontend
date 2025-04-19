import React from 'react'
import Button from '@mui/material/Button';
const Btn = (props) => {
  return (
    <div>
      <Button 
        variant="outlined"
        onClick={props.func}
        sx={{
          color: props.color,          // Text color
          borderColor: props.borderColor,      // Outline color
          backgroundColor: props.backgroundColor,
          "&:hover": {
            backgroundColor: props.backgroundColorHover,
            color: props.colorHover
          },
        }}
        size={props.size}
      >
        {props.icon}&nbsp;
        {props.btnType}
      </Button>
    </div>
  )
}
export default Btn
