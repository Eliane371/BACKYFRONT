import React, { useContext,useEffect, useState } from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'



const Products = () => {

  const {category} = useParams()
  const [filterProd, setFilterProd] = useState([])
  const navigate = useNavigate()
  const{product} =useContext(AppContext)
  
  const applyFilter = () => {
    if (category) {
      setFilterProd(product.filter(prod => prod.category === category))
    } else {
        setFilterProd(product)
        }
    }

useEffect(() => {
    applyFilter()
}, [product, category])

    return (
    <div>
        <p className='text-gray-600'>Busca por categoria</p>
        <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
            <div className='flex flex-col gap-4 text-sm text-gray-600'>
                <p onClick={()=> category === 'Jetsky' ? navigate('/products') : navigate('/products/Jetsky')} className={'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border-gray-300 rounded transition-all cursor-pointer ${category === "Jetsky" ? "bg-indigo-100 text-black" : ""}'} >Jetsky</p>
                <p onClick={()=> category === 'Cuatriciclo' ? navigate('/products') : navigate('/products/Cuatriciclo')} className={'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border-gray-300 rounded transition-all cursor-pointer ${category === "Cuatriciclo" ? "bg-indigo-100 text-black" : ""}'} >Cuatriciclo</p>
                <p onClick={()=> category === 'Equipo de Buceo' ? navigate('/products') : navigate('/products/Equipo de Buceo')} className={'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border-gray-300 rounded transition-all cursor-pointer ${category === "Equipo de Buceo" ? "bg-indigo-100 text-black" : ""}'} >Equipo de Buceo</p>
                <p onClick={()=> category === 'Tabla de surf' ? navigate('/products') : navigate('/products/Tabla de surf')} className={'w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border-gray-300 rounded transition-all cursor-pointer ${category === "Tabla de surf" ? "bg-indigo-100 text-black" : ""}'} >Tabla de surf</p>
            </div>
            <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                {
                    filterProd.map((item,index) => (
                        <div onClick={()=>navigate(`/reservas/${item.p_id}`)}  className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                            <img className='bg-blue-50' src={item.image} alt="" />
                            <div className='p-4'>
                                <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                    <p className='w-2 h-2 bg-green-500 rounded full'></p><p>Disponible</p>
                                </div>
                                <p className='text-gray-900 text-lg font-medium' >{item.name}</p>
                                <p className='text-gray-600 text-sm'>{item.category}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default Products