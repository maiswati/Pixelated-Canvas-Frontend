import React from 'react'
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import '../Special.css'
import "bootstrap/dist/css/bootstrap.min.css";

const PaintingSpace = (props) => {
  console.log(props.src);
  return (
        <Card sx={{display:"inline-block", margin: "2.3em", transform:"scale(0.5)"}}>
            <CardMedia
                className='space'
                component="img"
                image={props.src}
                alt={props.title}
                sx={{height:"auto", width:"100%"}}
            />
        </Card>
  )
}
export default PaintingSpace