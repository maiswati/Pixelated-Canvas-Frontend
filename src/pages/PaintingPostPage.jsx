import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import NavbarForPaintingPost from "../components/NavbarForPaintingPost";
import PaintingSpace from "../components/PaintingSpace";
import PaintingDescription from "../components/PaintingDescription";
import { useNavigate } from "react-router-dom";
import PriceDescriptionForHold from "../components/PriceDescriptionForHold";
import Ratings from "../components/Ratings";
// import { API_BASE_URL } from "../../features/auth/authAPI";
// import paintingModel from "../../../Backend/Models/painting.model";
// import { NavLink } from "react-router-dom";

const paintingPostPage = ()=> {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [paintingData, setPaintingData] = useState(null);
  const [correspondingAuctionData, setCorrespondingAuctionData] = useState(null);
  const [auctionId, setAuctionId] = useState(null);
  const [highestBidder, setHighestBidder] = useState(null);
  const [currentHighest, setCurrentHighest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [proceedToCheckout, setProceedToCheckout] = useState(false);
  const API = import.meta.env.VITE_API;

    const { id } = useParams(); //id is paintingId
    const location = useLocation();
    const userId = location?.state?.userId;
    const urlParams = new URLSearchParams(location.search);
    const buyerId = urlParams.get("buyerId");  //buyer id is buyer id who will be buying the painting.


    useEffect(() => {
      const newSocket = io(API, {
        transports: ["websocket"],
        autoConnect: true,
      });
      setSocket(newSocket);
    
      // 👉 Listen to disconnect event
      newSocket.on("disconnect", (reason) => {
        console.log("Disconnected from server:", reason);
        alert("You have been disconnected. Please refresh the page.");
        // Optionally: you can disable bidding buttons etc. here
      });
    
      return () => {
        // Clean up both socket and event listener
        newSocket.off("disconnect"); // <-- Important to avoid memory leaks
        newSocket.disconnect();
      };
    }, []);
    
    //fetching painting and corresponding to that painting the auction data for it.
    useEffect(() => {
      if(!socket || !id) return;

      const fetchPaintingData = async()=>{
        try{
           const response = await axios.get(`${API}/paintings/paintingpost/${id}`);
           setPaintingData(response.data.updatedPaintingData);
           setCorrespondingAuctionData(response.data.auctionData);
           setAuctionId(response.data.auctionData._id);
           setAuctionEnded(response.data.auctionData.status);

           if(socket && response.data.updatedPaintingData.category === "Auction" && response.data.auctionData._id) {
            socket.emit("joinAuction", {auctionId: response.data.auctionData._id, userId: buyerId});
            console.log("Joining auction room: ", response.data.auctionData._id);
            console.log(paintingData);
           }
        }catch(error) {
          console.log(error);
        }
      }
    
      fetchPaintingData();
    }, [socket, id]);
    console.log("PaintingData", paintingData);
    let user = null;
    let order = null;
    const loadRazorpay = async(id)=>{
      try{
          const response = await axios.post(`${API}/payment/order/${id}`, {winner: highestBidder});
          const {order: orderData, user: userData} = response.data || {};
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
                  paintingId: id,
                  buyerId: highestBidder,
                });
                if(res.data.success) {
                  toast("Payment Successful.");
                  navigate(`/submitShippingAddress/${id}/${highestBidder}`);   
                } else {
                  toast("Payment Verification Failed!");
                  navigate(`/paintings/paintingpost/${id}?buyerId=${highestBidder}`);
                }
              }catch(error) {
                  console.log(error);
                  toast("Payment Verification Error!");
                  navigate(`/paintings/paintingpost/${id}?buyerId=${highestBidder}`);
              }
            },
            prefill: {
              name: user.name,
              email: user.email
            },
            theme: {
              color: "#F5F5DC",
            },
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
      }catch(error) {
        console.log(error);
        alert("Failed to initiate payment. Try again later.");
      }
    }



    useEffect(() => {
      if (!socket) return;
    
      const handleAuctionUpdate = (data) => {
        console.log("Auction update received", data);
        setHighestBidder(data.highestBidder);
        setCurrentHighest(data.currentHighest);
        setTimeLeft(data.timeLeft);
        setAuctionEnded(data.auctionStatus);
      };
    
      const handleAuctionEnded = async(data) => {
        console.log("Auction ended:", data);
        setAuctionEnded(data.auctionStatus);
        alert(`Auction ended! Winner: ${data.highestBidder} with ₹${data.currentHighest}`);
      };

      const handleAuctionEndedConfirm = async(data) => {
        console.log("Checkout Allowed: ",data.proceedToCheckout);
        setProceedToCheckout(data.proceedToCheckout);
      }


      // Listen for auction events
      socket.on("joinAuction", handleAuctionUpdate);
      socket.on("updateTimer", handleAuctionUpdate);
      socket.on("newBid", handleAuctionUpdate);
      socket.on("auctionEnded", handleAuctionEnded);
      socket.on("auctionEndedConfirm", handleAuctionEndedConfirm);
    
      return () => {
        socket.off("joinAuction", handleAuctionUpdate);
        socket.off("updateTimer", handleAuctionUpdate);
        socket.off("newBid", handleAuctionUpdate);
        socket.off("auctionEnded", handleAuctionEnded); // ✅ Correctly removing event listeners
        socket.off("auctionEndedConfirm", handleAuctionEndedConfirm);
      };
    }, [socket]);

    const placeBid = () => {
      if (!auctionId || !buyerId || !bidAmount) {
        alert("Please enter a valid bid amount.");
        return;
      }
    
      socket.emit("placeBid", {
        auctionId,
        userId: buyerId,
        bidAmount: parseInt(bidAmount, 10),
      });
    
      // Delay clearing the input field slightly to ensure bid is processed
      setTimeout(() => {
        setBidAmount("");
      }, 100);
    };
    if(buyerId === "null") {
      navigate('/login');
    }
    if (!paintingData) {
      return <h2>Loading...</h2>;
    }
    if(auctionEnded && paintingData.buyerID === userId) {
      return (
        <>
          <NavbarForPaintingPost btnName="Logout" sellerId={userId || buyerId} navigateTo='/'/>
          <div className="container101">
          <PaintingSpace src={paintingData.file} title={paintingData.title} />
          <PaintingDescription
            buyerId={buyerId}
            paintingId={id}
            description={paintingData.description}
            title={paintingData.title}
            category={paintingData.category}
            fixedPrice={paintingData.fixedPrice}
            startingPrice={paintingData.startingPrice}
            bidIncrement={paintingData.bidIncrement}
            buyerID={paintingData.buyerID}
            userId={userId}
          />
          </div>
        </>
      )
    }
    if (auctionEnded) {
      return (
        <>
          <NavbarForPaintingPost
            btnName="Logout"
            sellerId={userId || buyerId}
          />
          <br />
          <br />
          <h2 className="text-danger m-3">Auction Has Ended.</h2>
          {proceedToCheckout && (
            <>
              <div class="card mb-5" style={{ width: "35rem" }}>
                <img
                  src="../../public/img/respect.jpg"
                  class="card-img-top"
                  alt="..."
                />
                <div class="card-body">
                  <h5 class="card-title">
                    🏆 Congratulations on Your Winning Bid!
                  </h5>
                  <p class="card-text text-danger">
                  To maintain the integrity of the auction and to honor the artist's dedication, we kindly request that you complete the payment process immediately.
                  </p>
                  <br />
                  <p>Please note:</p>
                  <ul>
                    <li>This is a <span className="text-danger fw-bold">one-time opportunity</span> linked to your winning bid.</li>
                    <li><span className="text-danger fw-bold">If you navigate away from this page or delay the payment</span>, your eligibility to purchase this painting will lapse.</li>
                    <li>The artwork may then be offered to the next eligible bidder or relisted for sale.</li>
                  </ul>
                      <button onClick={()=> loadRazorpay(id)} className="btn btn-success m-3">
                          Proceed to Checkout.
                      </button>
                </div>
              </div>
            </>
          )}
        </>
      );
    }
    return (
      <>
        <NavbarForPaintingPost btnName="Logout" sellerId={userId || buyerId} navigateTo='/'/>
        <div className="container101">
          {paintingData && paintingData.category === "Auction" ? (
            <div className="Price">
              <h3>Current Highest Bid: ₹{currentHighest}</h3>
              <h4>Highest Bidder: {highestBidder}</h4>
              <h4>Bid a higher amount in:  {timeLeft}</h4>
             {auctionEnded ? (
                <h3 style={{ color: "red" }}>Auction has ended</h3>    
              ) : (
                <>
                  <input
                    type="number"
                    placeholder="Enter your bid"
                    className="form-control"
                    disabled={auctionEnded}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                  <button onClick={placeBid} disabled={auctionEnded} className="btn btn-dark">
                    Send
                  </button>
                  <Ratings />
                </>
              )}
            </div>
          ) : (
            <PriceDescriptionForHold />
          )}
          <PaintingSpace src={paintingData.file} title={paintingData.title} />
          <PaintingDescription
            buyerId={buyerId}
            paintingId={id}
            description={paintingData.description}
            title={paintingData.title}
            category={paintingData.category}
            fixedPrice={paintingData.fixedPrice}
            startingPrice={paintingData.startingPrice}
            bidIncrement={paintingData.bidIncrement}
            buyerID={paintingData.buyerID}
            userId={userId}
          />
        </div>
      </>
    );
}

export default paintingPostPage;













