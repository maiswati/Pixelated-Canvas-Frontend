import React from 'react';
import { useState } from 'react';
import ImageWithBtn from '../components/ImageWithBtn';
import '../App.css';
import LoginIcon from '@mui/icons-material/Login';
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../../features/auth/authActions';
import { toast } from 'react-toastify';
const SignUpPage = () => {
  const dispatch = useDispatch();
  const {loading} = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(
    {
      name:'',
      age: 0,
      email: '',
      password: '',
      username: '',
      role: '',
    }
  );
  const handleChange = (e)=>{
    setFormData(
      {
        ...formData,
        [e.target.name]: e.target.value
      }
    )
  }
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const result = await dispatch(signupUser(formData)); 

        if (signupUser.fulfilled.match(result)) {
            localStorage.setItem("user", JSON.stringify(result.payload));
            toast.success("Registration Successful.");
            navigate('/login');
        } else {
            toast.error(result.payload || "Signup Failed");
        }
    } catch (error) {
        console.error("🔥 Error in handleSubmit:", error);
    }
};

  return (
    <div className='d-flex border'>
      <div className='w-100 d-flex align-items-center justify-content-center ms-2'>
        <div className='w-100 d-flex flex-column gap-3'>
          <label htmlFor="name" className="form-label fw-bold">Name</label>
          <input type="text" className="form-control fw-light login" placeholder='Name' id="name" name='name' value={formData.name} onChange={e => handleChange(e)}/>
          
          <label htmlFor="age" className="form-label fw-bold">Age</label>
          <input type="number" className="form-control fw-light login" placeholder='Age' id="age" name='age' value={formData.age} onChange={e => handleChange(e)}/>
          
          <label htmlFor="email" className="form-label fw-bold">Email</label>
          <input type="email" className="form-control fw-light login" placeholder='Email' id="email" name='email' value={formData.email} onChange={e => handleChange(e)}/>
          
          <label htmlFor="password" className="form-label fw-bold">Password</label>
          <input type="password" className="form-control fw-light login" placeholder='Password' id="password" name='password' value={formData.password} onChange={e => handleChange(e)}/>
          
          <label htmlFor="username" className="form-label fw-bold">Username</label>
          <input type="text" className="form-control fw-light login" placeholder='Username' id="username" name='username' value={formData.username} onChange={e => handleChange(e)}/>
          <label htmlFor="roleSelection" className="form-label fw-bold ">Select your role: </label>
          <div className='d-flex justify-content-evenly align-items-center'>
            <div>
            <label htmlFor="buyer" className="form-label fw-bold">Buyer</label> &nbsp;&nbsp;
            <input type="radio" className="form-check-input" name="role" id="buyer" value='Buyer' onChange={e => handleChange(e)}/>
            </div>
            <div>
            <label htmlFor="seller" className="form-label fw-bold">Seller</label>&nbsp;&nbsp; 
            <input type="radio" className="form-check-input" name="role" id="seller" value='Seller' onChange={e => handleChange(e)}/>
            </div>
          </div>
            <button onClick={(e)=>handleSubmit(e)} className='btn btn-warning signupBtn' disabled={loading}>{loading ? "Signing up....": "SignUp"}</button>
        </div>
      </div>

      <ImageWithBtn 
        endDistance="0" 
        imgSrc="/img/signup_image.jpg" 
        btnLabel1="Login" 
        icon1={<LoginIcon />} 
        nav1="/login" 
        nav2='/sellersignup' 
        btnLabel2="Seller" 
        icon2={<StorefrontOutlinedIcon />} 
      />
    </div>
  );
};

export default SignUpPage;
