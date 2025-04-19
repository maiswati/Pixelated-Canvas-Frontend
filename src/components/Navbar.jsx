import React from 'react'
// import SearchForm from './SearchForm';
import '../App.css'
import { NavLink } from 'react-router'
import { useDispatch } from 'react-redux'
import {toast} from 'react-toastify';
import { logoutUser } from '../../features/auth/authActions';
import { useNavigate } from 'react-router-dom';
const Navbar = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = async()=> {
    if(props.btnName === "Log out") {
      try {
        const response = await dispatch(logoutUser());
        if(logoutUser.fulfilled.match(response)) {
          toast.success("Logout Successfully.");
          navigate('/');
        }
    }catch(error) {
        console.log(error);
        toast.error("Logout Failed. Try again.");
    }
  } else {
    navigate('/login');
  }
  }
  return (
    <nav className="navbar1 navbar d-flex justify-content-evenly shadow-sm w-100">
        <div className="container-fluid" >
          <NavLink to='/'>
          <img 
            src="/img/logo2.png" 
            alt="Logo" 
            width="60" 
            height="60" 
            className="d-inline-block align-text-top" 
            />
          </NavLink>
            
            <h2>
              Pixelated Canvas
            </h2>
            <button className={`btn btn-outline-success me-2 btn2`} onClick={logout} type="button">{props.btnName}</button>
        </div>
    </nav>
  )
}

export default Navbar
