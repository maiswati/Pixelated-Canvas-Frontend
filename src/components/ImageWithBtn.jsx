import React from "react";
import Btn from "./Btn";
import '../App.css'
import { NavLink } from "react-router";
const ImageWithBtn = (props) => {
  return (
    <div className="container position-relative vh-100 m-0 p-0 overflow-hidden p-5"> 
      <div className={`card text-bg-dark border-0 position-absolute top-0 start-${props.startDistance} end-${props.endDistance} w-75 h-100 m-0 p-0`}>
        <div className="position-relative w-100 h-100">
          <img
            src={props.imgSrc}
            className="card-img w-100 h-100 object-fit-cover rounded-0"
            alt="Virtual Gallery"
          />
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
          <div className="position-absolute top-50 start-50 translate-middle d-flex flex-column gap-3">
            <NavLink to={props.nav1}>
            <Btn
              btnType={props.btnLabel1}
              color="#F5F5DC"
              borderColor="#F5F5DC"
              backgroundColor="#BFAF8D"
              backgroundColorHover="#F5F5DC"
              colorHover="#BFAF8D"
              size="small"
              icon={props.icon1}
            />
            </NavLink>  
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageWithBtn;


// card text-bg-dark border-0 position-absolute top-0 start- w-50 h-100 m-0 p-0