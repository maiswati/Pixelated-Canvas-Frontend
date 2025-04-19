import React from 'react'
import BtnGrp from './BtnGrp'
import '../Special.css'
import "bootstrap/dist/css/bootstrap.min.css";
const PaintingDescription = (props) => {
  const category = props.category;
  return (
    <div className='Desc'>
      <span>
        {/* {
          category==='Auction'? <AuctionCountdown/> : ''
        } */}
        <br/>
        <h2>{props.title}</h2>
        <h3>Artist</h3>
        <div className="painting-info">
          <h3>Category: <span>{props.category}</span></h3>
          <h3 className={category==='Auction' ? "d-block": "d-none"}>Starting Price: <span>₹{props.startingPrice}</span></h3>
          <h3 className={category==='Sale'? "d-block" : "d-none"}>Fixed Price: <span>₹{props.fixedPrice}</span></h3>
          <h3 className={category==='Auction'? "d-block": "d-none"}>Bid Increment: <span>₹{props.bidIncrement}</span></h3>
        </div>

        <p>{props.description}</p>
      </span>
      {
        props.buyerID ? <h3 className='text-danger'>Sold Out</h3> : <BtnGrp category={category} buyerId={props.buyerId} paintingId={props.paintingId} buyerID={props.buyerID}/>
      }
    </div>
  )
}

export default PaintingDescription