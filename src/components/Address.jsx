import React from 'react'
import '../Tansaction.css';
import { useState } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import { API_BASE_URL } from '../../features/auth/authAPI';
const Address = ({buyerId, paintingId}) => {
  const [formData, setFormData] = useState({
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const handleChange = (e)=> {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  const submitShippingAddress = async()=>{
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payment/submitShippingAddress/${buyerId}/${paintingId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(response.data.message);
      setFormData({
        phone: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      });
      toast.success(response.data.message || "Address Saved Successfully.");
    } catch(error) {
      console.log(error);
    }
  }
return (
    <div className="m-auto addr border border-2 border-warning-subtle p-3 rounded mb-5">
    <h3 className="mb-4 text-center lato-regular-italic">Shipping Address</h3>

    <div className="row g-3">
      <div className="col-md-6 form-floating">
        <input type="tel" name="phone" id="phone" placeholder="Phone Number" className="form-control inputs" required onChange={handleChange}/>
        <label htmlFor="phone">Phone Number<span className='text-danger'>*</span></label>
      </div>

      <div className="col-12 form-floating">
        <input type="text" name="address1" id="address1" placeholder="Address Line 1" className="form-control inputs" required  onChange={handleChange}/>
        <label htmlFor="address1">Address Line 1<span className='text-danger'>*</span></label>
      </div>

      <div className="col-12 form-floating">
        <input type="text" name="address2" id="address2" placeholder="Address Line 2" className="form-control inputs"   onChange={handleChange}/>
        <label htmlFor="address2">Address Line 2 (Optional)</label>
      </div>

      <div className="col-md-4 form-floating">
        <input type="text" name="city" id="city" placeholder="City" className="form-control inputs" required  onChange={handleChange}/>
        <label htmlFor="city">City<span className='text-danger'>*</span></label>
      </div>

      <div className="col-md-4 form-floating">
        <input type="text" name="state" id="state" placeholder="State" className="form-control inputs" required  onChange={handleChange}/>
        <label htmlFor="state">State<span className='text-danger'>*</span></label>
      </div>

      <div className="col-md-4 form-floating">
        <input type="text" name="zip" id="zip" placeholder="ZIP Code" className="form-control inputs" required  onChange={handleChange}/>
        <label htmlFor="zip">ZIP Code<span className='text-danger'>*</span></label>
      </div>

      <div className="col-12 form-floating">
      <input type="text" name="country" id="country" placeholder="Country" className="form-control inputs" required  onChange={handleChange}/>
        <label htmlFor="country">Country<span className='text-danger'>*</span></label>
      </div>
    </div>

    <button onClick={submitShippingAddress} className="button2 btn btn-primary w-100 mt-4">Submit Address</button>
  </div>
  )
}

export default Address

