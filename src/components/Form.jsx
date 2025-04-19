import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import "../App.css";
import backgroundImg from "/img/Warli.jpg";
import { API_BASE_URL } from "../../features/auth/authAPI";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const CLOUDINARY_UPLOAD_PRESET=import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME=import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const formStyle = {
  backgroundImage: `url(${backgroundImg})`,
  backgroundSize: "crop",
  backgroundPosition: "center",
  backgroundRepeat: "repeat",
  width: "100%",
  height: "150px",
  opacity: "0.7",
};
const Form = (props) => {
  const [disableFixedPrice, setDisableFixedPrice] = useState(true);
  const [disableStartingPrice, setDisableStartingPrice] = useState(true);
  const [disableBidIncrement, setDisableBidIncrement] = useState(true);
  const ifRadioBtnClicked = (e)=>{
      if(e.target.value === 'Sale') {
        setDisableFixedPrice(false);
        setDisableBidIncrement(true)
        setDisableStartingPrice(true)
      } else if(e.target.value === 'Auction') {
        setDisableBidIncrement(false);
        setDisableStartingPrice(false);
        setDisableFixedPrice(true);
      }else if(e.target.value === 'Hold'){
        setDisableBidIncrement(true);
        setDisableStartingPrice(true);
        setDisableFixedPrice(true);
      }
  }
  const [paintingData, setPaintingData] = useState({
    title:'',
    description:'',
    category: '',
    width: null,
    height: null,
    upiid: '',
    file:null,
    fixedPrice: null,
    startingPrice: null,
    bidIncrement: null,
  })
  const handleChange = (e)=>{
    if(e.target.name === 'file'){
      setPaintingData((prevState)=>({
        ...prevState,
        file: e.target.files[0],
      }))
    } else {
      setPaintingData((prevState)=>({
        ...prevState,
        [e.target.name]: e.target.value,
      }))
    }
  }
  const navigate = useNavigate();
  const uploadPainting = async()=>{
    try{
      const imageData = new FormData();
      imageData.append("file", paintingData.file);
      imageData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const cloudinaryRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        imageData
      );

      const imageURL = cloudinaryRes.data.secure_url;
      console.log(imageURL);
      const newPainting = new FormData();
      newPainting.append("title", paintingData.title);
      newPainting.append("description", paintingData.description);
      newPainting.append("category", paintingData.category);
      newPainting.append("upiid", paintingData.upiid);
      newPainting.append("width", paintingData.width);
      newPainting.append("height", paintingData.height);
      newPainting.append("fixedPrice", paintingData.fixedPrice);
      newPainting.append("startingPrice", paintingData.startingPrice);
      newPainting.append("bidIncrement", paintingData.bidIncrement);
      newPainting.append("file", imageURL);

      const response = await axios.post(`${API_BASE_URL}/paintings/newpaintingform/${props.id}`, newPainting);
      console.log(response);
      toast.success(response.data.message);
      navigate(`/users/userprofile/${props.id}`);

    }catch (error) {
      console.log("Cloudinary Error:", error?.response?.data || error.message || error);
      toast.error("Image upload failed. Check console for details.");
    }
  }
    
  
  return (
    <div className="w-75 mx-auto">
      <div style={formStyle} className="mb-3"></div>
      <br />
      <label htmlFor="title" className="form-label fw-bold">
        Painting Title<span className="text-danger">*</span>:
      </label>
      <input
        type="text"
        className="form-control fw-light"
        name="title"
        onChange={handleChange}
        id="title"
        placeholder="Enter Title of Painting here.."
      />
      <br />
      <label htmlFor="description" className="form-label fw-bold">
        Painting Description<span className="text-danger">*</span>:
      </label>
      <input
        type="text"
        className="form-control fw-light"
        name="description"
        id="description"
        onChange={handleChange}
        placeholder="Enter Description of Painting here.."
      />
      <br />
      <label htmlFor="title" className="form-label fw-bold">
        Choice of Painting<span className="text-danger">*</span>:
      </label>
      <br />
      <label htmlFor="hold" className="form-label fw-light">
        Hold
      </label>
      &nbsp;
      <input
        type="radio"
        className="form-check-input"
        id="hold"
        name="category"
        value="Hold"
        onChange={handleChange}
      />
      <br />
      <label htmlFor="sale" className="form-label fw-light">
        Sale
      </label>
      &nbsp;
      <input
        type="radio"
        className="form-check-input"
        id="sale"
        name="category"
        value="Sale"
        onChange={handleChange}
        onClick={(e)=> ifRadioBtnClicked(e) }
      />
      <br />
      <label htmlFor="auction" className="form-label fw-light">
        Auction
      </label>
      &nbsp;
      <input
        type="radio"
        className="form-check-input"
        id="auction"
        name="category"
        onChange={handleChange}
        value="Auction"
        onClick={(e)=> ifRadioBtnClicked(e) }
      />
      <br />
      <br />
        <div>
          <label className="form-label fw-bold">Fixed Price</label>
          <input
            type="number"
            className="form-control fw-light"
            disabled = {disableFixedPrice}
            name="fixedPrice"
            onChange={handleChange}
            placeholder="Enter Fixed Price of Painting"
          />
          <br />
        </div>
        <div>
          <label className="fw-bold">Starting Price for Bidding:</label>
          <input
            type="number"
            className="form-control fw-light"
            disabled = {disableStartingPrice}
            onChange={handleChange}
            name="startingPrice"
            placeholder="Enter Starting Price of Painting for Auction"
          />
          <br /> <label className="form-label fw-bold">Bid Increment</label>
          <input
            type="number"
            className="form-control fw-light"
            disabled = {disableBidIncrement}
            onChange={handleChange}
            name="bidIncrement"
            placeholder="Enter Bid Increment:"
          />
          <br />
        </div>
        <label id="upiid" className="form-label fw-bold">
        UPI ID:<span className="text-danger">*</span>
      </label>
      <input
        type="text"
        className="form-control fw-light"
        id="upiid"
        name="upiid"
        onChange={handleChange}
        placeholder="Enter UPI ID for Payment:"
      />
      <br />
      <label id="width" className="form-label fw-bold">
        Painting Width:<span className="text-danger">*</span>
      </label>
      <input
        type="number"
        className="form-control fw-light"
        id="width"
        name="width"
        onChange={handleChange}
        placeholder="Enter Width for Painting:"
      />
      <br />
      <label id="height" className="form-label fw-bold">
        Painting Height:<span className="text-danger">*</span>
      </label>
      <input
        type="number"
        className="form-control fw-light"
        name="height"
        onChange={handleChange}
        id="height"
        placeholder="Enter Height for Painting:"
      />
      <br />
      <div class="mb-3">
        <label for="formFile" class="form-label fw-bold">
          Upload your Painting<span className="text-danger">*</span>: 🎨
        </label>
        <input class="form-control" type="file" onChange={handleChange} id="formFile" name="file"/>
      </div>
      <br />
      <button className="btn btn-secondary" onClick={uploadPainting}>Submit</button>
      <br />
      <br />
    </div>
  );
};

export default Form;
