import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>SOBRE <span className='text-gray-700 font-semibold'>NOSOTROS</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Descubre la libertad del mar con BeachRent Perú. Alquilamos todo lo que necesitas para tu aventura perfecta en la playa: desde emocionantes JetSkis hasta tablas de surf para grandes y chicos. ¡Sol, arena y diversión te esperan!</p>
          <b className='text-gray-800'>Nuestra Vision</b>
          <p>Ser la empresa líder en alquiler de productos recreativos de playa en el litoral peruano, reconocida por ofrecer experiencias inolvidables, servicios innovadores y atención de calidad que conecten a las personas con la naturaleza, el deporte y la aventura.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>POR QUE <span className='text-gray-700 font-semibold'>ESCOGERNOS</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFICIENCIA:</b>
          <p>BeachRent Perú destaca por su eficiencia al ofrecer un servicio rápido, confiable y totalmente digitalizado que garantiza una experiencia sin contratiempos para cada cliente.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>FLEXIBILIDAD: </b>
          <p>Se adapta a las necesidades de cada cliente, ofreciendo horarios flexibles, múltiples métodos de pago y opciones personalizadas para que disfrutes la playa a tu manera.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>OFERTAS:</b>
          <p >Ofrece una amplia variedad de equipos de playa en alquiler, ideales para disfrutar al máximo del sol, el mar y la aventura.</p>
        </div>
      </div>

    </div>
  )
}

export default About
