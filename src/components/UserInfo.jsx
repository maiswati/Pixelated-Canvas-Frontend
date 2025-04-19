import React from 'react'
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
const UserInfo = (props) => {
  const {id} = useParams();
  // const goToGallery = () => {
  //   window.location.href = `/gallery?Id=${id}`;
  // };
  const firstletter = props.user.name.charAt(0);
  return (
    <div className="d-flex btn3 justify-content-evenly align-items-center background mt-5">
        <div className="d-flex justify-content-between align-items-center me-2">
          <div>
            <Avatar
              color="warning"
              size="lg"
              variant="solid"
              sx={{ "--Avatar-size": "80px" }}
            >
              {firstletter}
            </Avatar>
          </div>
          <div className="ms-5">
          <h2><span class="badge text-bg-dark">{props.user.username}</span></h2>
          <span class="badge text-bg-warning">{props.user._id}</span>
          </div>
        </div>
        <div>
        <NavLink to={`/gallery?Id=${id}`} style={{textDecoration:"none"}}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", height:"10vh"}}>
            <Button
              sx={{
                backgroundColor: "#D1A76D",
                color: "black",
                "&:hover": {   
                  backgroundColor: "#F6E1B5",
                },
              }}
              startDecorator={<OpenInNew />}
            >
              Step Into Virtual Gallery
            </Button>
            <IconButton
              aria-label="Open in new tab"
            ></IconButton>
          </Box>
          </NavLink>
        </div>
      </div>
  )
}

export default UserInfo
