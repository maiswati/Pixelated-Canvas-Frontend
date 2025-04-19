import React from 'react'
import Navbar from '../components/Navbar'
import UserProfileHeader from '../components/UserProfileHeader'
import PaintingGrid from '../components/PaintingGrid'
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../features/auth/authAPI'
const UserProfilePage = () => {
  const location = useLocation();
  const params = useParams();
  const id = location.state?.id || params.id;
  const [user, setUser] = useState(null);
  const [paintingData, setPaintingData] = useState(null);
  useEffect(() => {
    const fetchUser = async()=>{
      try{
          const response = await axios.get(`${API_BASE_URL}/users/userprofile/${id}`);
          setUser(response.data.user);
          setPaintingData(response.data.updatedPaintings);
          console.log("Fetched Paintings: ", response.data.updatedPaintings);
      } catch(error) {
        console.error("Error fetching user data.", error);
      }
    }
    fetchUser();
  }, [id]);
  console.log("userprofile page",paintingData);
  if(!user) return <p>Loading....</p>;
  return (
    <div>
      <Navbar btnName="Log out" navigateTo="/"/>
      <UserProfileHeader user={user}/>
      <PaintingGrid paintingData={paintingData} user={user}/>
    </div>
  )
}

export default UserProfilePage
