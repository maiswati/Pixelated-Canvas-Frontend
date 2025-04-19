import * as React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import '../Special.css'
import "bootstrap/dist/css/bootstrap.min.css";

const Ratings = () => {
  return (
    <Stack spacing={1}>
      <Rating name="half-rating" defaultValue={2.5} precision={0.5} size='large'/>
      {/* <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly /> */}
    </Stack>
  )
}

export default Ratings