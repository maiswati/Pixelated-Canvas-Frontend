import React from 'react'
import DialogCard from '../components/DiaglogBox'
import Btn from '../components/Btn'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const EntryPage = () => {
  return (
    <div>
        <div className='d-flex justify-content-between align-items-center'>
        <Navbar btnName="Login" navigateTo="/login"/>
        </div>
      <DialogCard/>
      <Footer/>
    </div>
  )
}

export default EntryPage