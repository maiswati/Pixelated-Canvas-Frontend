import React from 'react'
import '../App.css'
import { NavLink } from 'react-router'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { logoutUser } from '../../features/auth/authActions';
const Navbar = (props) => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const logout = async() => {
    if(props.btnName === "Log out") {
      try{
        const response = await dispatch(logoutUser());
        if(logoutUser.fulfilled.match(response)) {
          toast.success("Logout Successful.");
          navigate('/');
        }
      }
      catch(error) {
        console.log(error);
        toast.error("Logout failed. Try again.");
      }
    } else {
      navigate('/login');
    }
   }
  return (
    <nav className="navbar1 navbar d-flex justify-content-evenly shadow-sm w-100" style={{backgroundColor:"#F6E1B5"}}>
        <div className="container-fluid" >
          <NavLink to={`/users/userprofile/${props.sellerId}`} state={{id: props.sellerId}} >
          <img 
            src="/img/avatarImage.avif" 
            alt="Logo" 
            width="80" 
            style={{borderRadius: "50%"}}
            height="80" 
            className="d-inline-block align-text-top" 
            />
          </NavLink>
            
            <h2>
              Pixelated Canvas
            </h2>
            <button className={`btn btn-outline-success me-2 btn2`} onClick={logout} type="button">{props.btnName}</button>
            {/* <SearchForm /> */}
        </div>
    </nav>
  )
}

export default Navbar
