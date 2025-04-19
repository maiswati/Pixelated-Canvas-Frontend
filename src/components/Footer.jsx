import React from 'react'
import '../App.css'
const Footer = () => {
  return (
    <footer className="footer sticky-bottom ">
    <p>&copy; 2025 Virtual Art Gallery. All rights reserved.</p>
    <div className="footer-links">
      <a href="/terms">Terms and Conditions</a>
      <a href="/privacy">Privacy Policy</a>
      <a href="/contact">Contact Us</a>
    </div>
    <p className="disclaimer">
      Disclaimer: All artworks displayed are for educational and artistic purposes.
    </p>
  </footer>
  )
}

export default Footer