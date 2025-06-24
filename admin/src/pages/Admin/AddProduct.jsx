import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddProduct = () => {

    const [prodImg, setProdImg] = useState(false)
    const [name, setName] = useState('')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [category, setCategory] = useState('')


    //const { backendUrl } = useContext(AppContext)
    const { aToken,backendUrl } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!prodImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();

            formData.append('image', prodImg)
            formData.append('name', name)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('category', category)


            // console log formdata            
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            const { data } = await axios.post(backendUrl + '/api/admin/add-product', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setProdImg(false)
                setName('')
                setAbout('')
                setFees('')
                setCategory('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
       <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Add Product</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="prod-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={prodImg ? URL.createObjectURL(prodImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setProdImg(e.target.files[0])} type="file" id="prod-img" hidden />
                    <p>Upload product <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Product name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Product fees' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Category</p>
                            <select onChange={e => setCategory(e.target.value)} value={category} className='border rounded px-2 py-2'>
                                <option value="Jetsky">Jetsky</option>
                                <option value="Cuatriciclo">Cuatriciclo</option>
                                <option value="Equipo de Buceo">Equipo de Buceo</option>
                                <option value="Tabla de surf">Tabla de surf</option>
                            </select>
                        </div>

                    </div>

                </div>

                <div>
                    <p className='mt-4 mb-2'>About Product</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' rows={5} placeholder='descripcion producto'></textarea>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Agregar Producto</button>

            </div>


        </form>
    
    )
}

export default AddProduct