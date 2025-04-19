import React from 'react'
import GridElement from './GridElement';
import Box from '@mui/joy/Box';

const PaintingGrid = ({paintingData, user}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        marginTop: 8,
        px: 2,
        py: 3,
        backgroundColor: "#333333",
        overflow: 'auto',
        width: "100%",
        scrollSnapType: 'x mandatory',
        '& > *': {
          scrollSnapAlign: 'center',
        },
        '::-webkit-scrollbar': { display: 'none' },
      }}
    >
    {
        paintingData.map((card)=>{
            return (
              <>
                <GridElement id={card._id} title={card.title} src={card.file} description={card.description} card={card} sellerId={card.sellerID} userId={user._id}/>
              </>

            )
        })
    }
</Box>
  )
}

export default PaintingGrid
