import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Reservas = () => {

    const { _id } = useParams()
    const { product, currencySymbol,backendUrl, getProductData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [prodInfo, setProdInfo] = useState(null)
    const [prodSlots, setProdSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')


    const navigate = useNavigate()
    const fetchProdInfo = async () => {
       const prodInfo = product.find((prod) => prod._id === _id);
       console.log(prodInfo); // Verifica si se obtiene el producto
       setProdInfo(prodInfo);
   }

    const getAvailableSlots = async () => {
        setProdSlots([])

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                const isSlotAvailable = prodInfo.slots_booked[slotDate] && prodInfo.slots_booked[slotDate].includes(slotTime) ? false : true

                if (isSlotAvailable) {

                    // Add slot to array
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                // Increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }

            setProdSlots(prev => ([...prev, timeSlots]));
            console.log(prodSlots); // Verifica si se están generando los slots
        }
    }

    const bookAppointment = async () => {
        
        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }
        const date = prodSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = `${day}_${month}_${year}`
        console.log(slotDate, slotTime)

        try {

            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { _id, slotDate, slotTime }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getProductData()
                navigate('/my-reservas')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        if (product.length > 0) {
            fetchProdInfo()
        }
    }, [product, _id])

    useEffect(() => {
        if (prodInfo) {
            getAvailableSlots()
        }
    }, [prodInfo])

    return prodInfo ? (
        <div>
            {/* ---------- Product Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={prodInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

                    {/* ----- Prod About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            Sobre <img className='w-3' src={assets.info_icon} alt="" />
                        </p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{prodInfo.about}</p>
                    </div>

                    <p className='text-gray-500 font-medium mt-4'>
                        Precio cupo: <span className='text-gray-600'>{currencySymbol}{prodInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/* Seccion de cupos */}
            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                <p>Cupos</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {prodSlots.length && prodSlots.map((item, index) => (
                        <div
                            onClick={() => setSlotIndex(index)}
                            key={index}
                            className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
                        >
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {prodSlots.length && prodSlots[slotIndex].map((item, index) => (
                        
                        
                        <p
                            onClick={() => setSlotTime(item.time)}
                            key={index}
                            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
                        >
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>



                <button
                    onClick={bookAppointment}
                    className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
                    Reserve un cupo
                </button>
            </div>

            
        </div>
    ) : null
}

export default Reservas



