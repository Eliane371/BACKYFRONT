import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const MisReservas = () => {

    const { product } = useContext(AppContext)

    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>Mis Reservas</p>
            <div className=''>
                {product.slice(0, 2).map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b'>
                        <div>
                            <img className='w-32 bg-indigo-50' src={item.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-zinc-600'>
                            <p className='text-neutral-800 font-semibold'>{item.name}</p>
                            <p>{item.category}</p>
                            <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Fecha y Hora:</span> 25, July, 2024 |  8:30 PM</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end'>
                            <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Paga Online</button>
                            <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancelar Reserva</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MisReservas