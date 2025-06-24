import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {

    const [isEdit, setIsEdit] = useState(false)

    const [image, setImage] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)
    
    
    /*const [userData, setUserData] = useState({
        name: "Richard James",
        image: assets.profile_pic,
        email: 'richardjames@gmail.com',
        phone: '+1  123 456 7890',
        address: {
            line1: '57th Cross, Richmond',
        },
        gender: 'Masculino',
        dob: '2000-01-20'
    })*/

    // Function to update user profile data using API
    const updateUserProfileData = async () => {

        try {

            const formData = new FormData();

            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('gender', userData.gender)
            formData.append('dateb', userData.dob)

            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }


    return (
        <div className='max-w-lg flex flex-col gap-2 text-sm'>
            {isEdit
                ? <label htmlFor='image' >
                    <div className='inline-block relative cursor-pointer'>
                        <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
                        <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
                    </div>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                </label>
                : <img className='w-36 rounded' src={userData.image} alt="" />
            }

            {isEdit
                ? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
                : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
            }

            <hr className='bg-zinc-400 h-[1px] border-none' />
            <div>
                <p className='text-neutral-500 underline mt-3'>INFORMACION DE CONTACTO</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'>Email id:</p>
                    <p className='text-blue-500'>{userData.email}</p>
                    <p className='font-medium'>Celular:</p>
                    {isEdit
                        ? <input className='bg-gray-100 max-w-52' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
                        : <p className='text-blue-400'>{userData.phone}</p>}
                </div>
            </div>
            <div>
                <p className='text-neutral-500 underline mt-3'>INFORMACION BASICA</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'>Genero:</p>
                    {isEdit
                        ? <select className='max-w-20 bg-gray-100' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender} >
                            <option value="Male">Masculino</option>
                            <option value="Female">Femenino</option>
                        </select>
                        : <p className='text-gray-400'>{userData.gender}</p>}
                    <p className='font-medium'>Fecha de nacimiento:</p>
                    {isEdit
                        ? <input className='max-w-28 bg-gray-100' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dateb: e.target.value }))} value={userData.dateb} />
                        : <p className='text-gray-400'>{userData.dateb}</p>}
                </div>
            </div>
            <div className='mt-10'>
                {
                    isEdit
                        ? <button onClick={() => setIsEdit(false)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Guardar Informacion</button>
                        : <button onClick={() => setIsEdit(true)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Editar</button>
                }
            </div>
        </div>
    )
}

export default MyProfile