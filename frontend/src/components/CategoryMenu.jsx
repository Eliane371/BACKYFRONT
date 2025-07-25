import React from 'react'
import {categoryData} from '../assets/assets'
import { Link } from 'react-router-dom'

const CategoryMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='category'>
        <h1 className='text-3xl font-medium'> Encuentra la categoria que buscas </h1>
        <p className='sm:w-1/3 text-center text-sm'> Busca en nuestro menu de categorias y encuentra lo que buscas.
        <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
            {categoryData.map((item,index) => (
                <Link onClick={()=>scrollTo(0,0)} className='flex flex-col item-center text-xs curso-pointer flex-shrik-0 hover:translate-y-[-10px] trnsition-all-duration-500' key={index} to={`/products/${item.category}`}>
                    <img className='w-16 sm:w-28 mb-2' src={item.image} alt="" />
                    <p>  {item.category} </p>
                </Link>
                ))}
        </div>
        </p>
    </div>
  )
}

export default CategoryMenu