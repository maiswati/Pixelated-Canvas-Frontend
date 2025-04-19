import React from 'react'
import Ratings from './Ratings'
import AddIcon from '@mui/icons-material/Add';
import '../Special.css'
const PriceDescription = (props) => {
      return (
          <div className='Price'>
          <div>
            <button className='btn btn-secondary'>Bid Increment <AddIcon/></button>
            <br /><br />
            <div className='money'>
                <label htmlFor="bid" className='form-label'>Enter Bid:</label>
                <br />
                <input type="number" id='bid' className='form-control' placeholder='Enter new Bid:' />
                <br />
                <button className='btn btn-dark'>Send</button>
            </div>    
        </div>
          
          <h3>Current Highest Bid: <span style={{ color: "red", fontWeight: "bold" }}>{props.startingPrice}</span></h3>
        </div>
        
      )
  
}

export default PriceDescription