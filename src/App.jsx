import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUpPage from './pages/SignUpPage';
import EntryPage from './pages/EntryPage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import PaintingPostPage from './pages/PaintingPostPage';
import FormToAddNewPage from './pages/FormToAddNewPage';
import AddressPage from './pages/AddressPage';
import GalleryPage from './pages/GalleryPage';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<EntryPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/users/userprofile/:id' element={<UserProfilePage/>}></Route>
        <Route path='/paintings/paintingpost/:id' element={<PaintingPostPage/>}></Route>
        <Route path='/paintings/newpaintingform/:id' element={<FormToAddNewPage/>}></Route>
        <Route path='/submitShippingAddress/:paintingId/:buyerId' element={<AddressPage/>}/>
        <Route path='/gallery' element={<GalleryPage/>}/>
      </Routes>
    </Router>
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
