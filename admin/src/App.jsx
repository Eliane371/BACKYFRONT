import React, { useContext } from 'react'
import { ProductContext } from './context/ProductContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddProduct from './pages/Admin/AddProduct';
import ListaProducts from './pages/Admin/ListaProducts';
import Login from './pages/Login';
//import DoctorAppointments from './pages/Doctor/DoctorAppointments';
//import DoctorDashboard from './pages/Doctor/DoctorDashboard';
//import DoctorProfile from './pages/Doctor/DoctorProfile';
const App = () => {

  //const { dToken } = useContext(ProductContext)
  const { aToken } = useContext(AdminContext)

  return aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start' >
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-product' element={<AddProduct />} />
          <Route path='/product-list' element={<ListaProducts />} />
        </Routes>
      </div>
    </div>
  ):(
    <>
      <Login/>
      <ToastContainer />
    </>
  )
  
}

export default App

