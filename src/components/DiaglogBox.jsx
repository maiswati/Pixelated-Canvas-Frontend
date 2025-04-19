import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import OpenInNew from "@mui/icons-material/OpenInNew";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
import '../App.css';


const DialogCard = () => {
  // const goToGallery = () => {
  //   window.location.href = `/gallery`;
  // };
  return (
    <div className="container">
      <Card 
        sx={{ maxWidth: 745, width: 500, border: "2px solid #A89F8D", borderRadius: 2, boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)" }} 
        align="center" 
        className="card"
      >
        <CardMedia
          component="img"
          alt="Starry Night"
          height="240"
          image="/img/DialogImage.jpg"
          sx={{
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
        <CardContent>
          {/* Title */}
          <Typography
            variant="h3"
            sx={{
              color: "white",
              WebkitTextStroke: "1px black",
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            Virtual Art Gallery
          </Typography>
          <CardActions align="center">
            <NavLink to='/gallery' style={{textDecoration:"none"}}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", height:"10vh"}}>
            <Button
              sx={{
                backgroundColor: "#D1A76D",
                color: "black",
                "&:hover": {   
                  backgroundColor: "#F6E1B5",
                },
              }}
              startIcon={<OpenInNew />}
            >
              Step Into Virtual Gallery
            </Button>
            <IconButton
              aria-label="Open in new tab"
            ></IconButton>
          </Box>
          </NavLink>
        </CardActions>
          {/* Instructions */}
          <div align="center">
          <p>Discover & Own Timeless Art</p>
            <p>🖼 Explore a curated collection of breathtaking paintings</p>
            <p>✨ Each piece tells a unique story—find the one that speaks to you!</p>
            <p>🔹 Authentic, Handpicked Artworks</p>
            <p>🔹 Exclusive, Limited Edition Pieces</p>
            <p>🔹 Secure Payments & Worldwide Shipping</p> 
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
              Instructions
            </Typography>
            <Typography variant="body1">Arrow Keys Or W/A/S/D To Look Around</Typography>
            <Typography variant="body1">Mouse to Look Around</Typography>
            <Typography variant="body1">Click on the paintings for Focused View</Typography>
            <br /><br />
          </div>
        </CardContent>

        
      </Card>
    </div>
  );
}

export default DialogCard;
