import React from 'react'
import TextField from '@mui/material/TextField';
const FormInput = (props) => {
  return (
    <div>
      <TextField 
        id="outlined-basic" 
        label={props.label} 
        variant="outlined" 
        sx={{
            
            "& label": { color: props.color }, // Label color
            "& label.Mui-focused": { color: props.colorFocused }, // Label color when focused
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: props.borderColor }, // Default border color
              "&:hover fieldset": { borderColor: props.borderColorhover }, // Border color on hover
              "&.Mui-focused fieldset": { borderColor: props.borderColorFocused }, // Border color when focused
            },
            width: "100%",
          }}
          name = {props.name}
      />
    </div>
  )
}

export default FormInput
