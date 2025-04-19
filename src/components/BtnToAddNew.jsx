import React from 'react'
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { NavLink } from 'react-router';
const BtnToAddNew = (props) => {
  const id = props.user._id;
  return (
   <NavLink to={`/paintings/newpaintingform/${id}`}><div className='mx-auto w-50 mt-5'><Button variant="contained" sx={{backgroundColor:"#D1BFA2", color:"Black"}} endIcon={<SendIcon />}>
    New Painting
  </Button></div></NavLink>
  )
}

export default BtnToAddNew




