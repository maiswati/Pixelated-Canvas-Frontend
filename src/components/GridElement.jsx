import React from 'react'
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import { NavLink } from 'react-router';
const GridElement = (props) => {
  console.log(props.src);
  return (
    <NavLink className="remove" to={`/paintings/paintingpost/${props.id}`} state={{userId: props.userId}}>
      <Card orientation="vertical" size="sm" key={props.title} variant="outlined" >
          <AspectRatio ratio="1" sx={{ minWidth: 250 }}>
            <img
            srcSet={`${props.src}?h=120&fit=crop&auto=format&dpr=2 2x`}
              src={`${props.src}?h=120&fit=crop&auto=format&dpr=2`}
              alt="egdytf"
            />
          </AspectRatio>
          <Box sx={{ whiteSpace: 'nowrap', mx: 1 }}>
            <Typography level="title-md">{props.title}</Typography>
            <Typography level="body-sm">{props.description}</Typography>
          </Box>
        </Card>
    </NavLink>
  )
}

export default GridElement



