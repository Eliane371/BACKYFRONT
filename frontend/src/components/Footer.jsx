import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/*-----lado izquiedo-----*/}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 test-gray-600 leading-6'>En BeachRent Perú nos dedicamos al alquiler de equipos de playa de forma rápida, segura y accesible. Ya sea que busques adrenalina sobre un JetSky o relajarte con una tabla de surf, tenemos el equipo ideal para ti.</p>
            </div>
            {/*-----lado central-----*/}
            <div>
                <p className='text-xl font-medium mb-5'>BeachRent Peru</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>Sobre Nosotros</li>
                    <li>Contactanos</li>
                </ul>
            </div>
            {/*-----lado derecho-----*/}
            <div>
                <p className='text-xl font-medium mb-5'>Comunicate con nosotros</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+51 959588449</li>
                    <li>contact_center@beachrent.com</li>
                </ul>
            </div>
        </div>
        {/*-----Copyright Text-----*/}
        <div>
            <hr />
            <p className='py-5 text-sm text-center'> Copyright 2025@ BeachRent Peru All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer