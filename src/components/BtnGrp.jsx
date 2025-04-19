import * as React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Button from "@mui/material/Button"; 
import '../Special.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router';

const BtnGrp = (props) => {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API;
  let user = null;
  let order = null;
  const loadRazorpay = async(id)=>{
      try{
          const response = await axios.post(`${API}/payment/order/${id}`, {winner: props.buyerId});
          const { order: orderData, user: userData } = response.data || {};
          if (!orderData) {
            throw new Error("Failed to create order. Please try again.");
          }
          if (!userData) {
            throw new Error("Failed to fetch user info. Please try again.");
          }
          user = userData;
          order = orderData;
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: "INR",
            order_id: order.id,
            name: "Pixelated Canvas",
            description: "Payment for Painting",
            image: "/img/logo2.png",
            handler:async function (response) {
              const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = response;
              try{
                const res = await axios.post(`${API}/payment/verify`, {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                  paintingId: props.paintingId,
                  buyerId: props.buyerId,
                });
                if(res.data.success) {
                  toast("Payment Successful.");
                  navigate(`/shippingAddressInfo/${props.paintingId}/${props.buyerId}`);
                } else {
                  toast("Payment Verification Failed!");
                  navigate(`/paintings/paintingpost/${props.paintingId}?buyerId=${props.buyerId}`);
                }
              }catch(error) {
                  console.log(error);
                  toast("Payment Verification Error!");
                  navigate(`/paintings/paintingpost/${props.paintingId}?buyerId=${props.buyerId}`);
              }
            },
            prefill: {
              name: user.name,
              email: user.email
            },
            theme: {
              color: "#F37254",
            },
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
      }catch(error) {
        console.log(error);
        alert("Failed to initiate payment. Try again later.");
      } 
    }
  return props.category === "Sale" ?  (
    <div className="m-5">
        <Button variant="outlined" color="secondary" onClick={()=>loadRazorpay(props.paintingId)} aria-label="Proceed To Check-Out" sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }} >
                <ShoppingCartIcon sx={{ color: "secondary.main" }} />
                Proceed To CheckOut
        </Button>
    </div>
  ) : null
}

export default BtnGrp