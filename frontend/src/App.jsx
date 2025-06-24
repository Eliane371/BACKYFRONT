import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import Reservas from './pages/Reservas'
import MisReservas from './pages/MisReservas'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>} /> 
        <Route path='/products' element={<Products />} />
        <Route path='/products/:category' element={<Products />} /> 
        <Route path='/login' element={<Login />} /> 
        <Route path='/about' element={<About />} />  
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/reservas/:_id' element={<Reservas />} />
        <Route path='/my-reservas' element={<MisReservas />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App