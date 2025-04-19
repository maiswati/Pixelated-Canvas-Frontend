import React from 'react';
import ImageWithBtn from '../components/ImageWithBtn';
import '../App.css'
import { NavLink } from 'react-router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../../features/auth/authActions';
export default function SimpleImageButton() {
  const dispatch = useDispatch();
  const {loading} = useSelector((state)=> state.auth)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const handleChange = (e)=>{
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const navigate = useNavigate();
  const handleSubmit =async (e)=>{
    e.preventDefault();
    try{
      const result = await dispatch(loginUser(formData));
      console.log(result);
      if(loginUser.fulfilled.match(result)) {
        console.log("Result payload:", result.payload);
          localStorage.setItem('user', JSON.stringify(result.payload));
          toast.success("Login Successful.");
          navigate(`/users/userprofile/${result.payload._id}`);
      } else {
        toast.error(result.payload || "Login Failed.");
      }

    }catch(error) {
        console.error("Error in handleLogin.", error);
    }
  }
  return (
    <div className='d-flex border w-100'>
      <ImageWithBtn startDistance="0" imgSrc="/img/login_image.jpg"   btnLabel1="SignUp" nav1="/signup" />
      <div className='w-50 d-flex align-items-center justify-content-center me-3 loginTextfields'>
        <div className='w- d-flex flex-column gap-3'>
        <label htmlFor="username" className="form-label fw-bold">
        Username
      </label>
      <input
        type="text"
        className="form-control fw-light login"
        placeholder='Username'
        id="username"
        name='username'
        value={formData.username}
        onChange={(e)=> handleChange(e)}
      />
      <label htmlFor="password" className="form-label fw-bold">
        Password
      </label>
      <input
        type="password"
        className="form-control fw-light login"
        placeholder='Password'
        id="password"
        name='password'
        value={formData.password}
        onChange={(e)=> handleChange(e)}
      />
        <NavLink to='/userprofile'>
        <button onClick={(e)=> handleSubmit(e)} className='btn btn-warning signupBtn' disabled={loading}>{loading ? "Logging in....": "Login"}</button>
        </NavLink>
        </div>
      </div>
    </div>
    
  );
}
