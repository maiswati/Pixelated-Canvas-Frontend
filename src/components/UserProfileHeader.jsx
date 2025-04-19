import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import UserInfo from "./UserInfo";
import BtnToAddNew from "./BtnToAddNew";
const UserProfileHeader = (props) => {
  const UserRole = props.user.role;
  return (
    <>
      <UserInfo user={props.user}/>
      <br />
      <hr />
      {
        UserRole==="Seller"? <BtnToAddNew user={props.user} btnName="New Painting"/> : '' 
      }
    </>
  );
};

export default UserProfileHeader;
