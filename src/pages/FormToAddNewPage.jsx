import React from 'react'
import Navbar from '../components/Navbar'
import '../App.css'
import { useParams } from 'react-router-dom'
import Form from '../components/Form'
const FormToAddNewPage = () => {
  const {id} = useParams();
  return (
    <div>
      <Navbar btnName="Log out"/>
      <Form id={id}/>
    </div>
  )
}

export default FormToAddNewPage
