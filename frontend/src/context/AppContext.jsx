import { createContext, useEffect, useState} from "react";
import { toast } from "react-toastify";
import axios from "axios"

export const AppContext = createContext()
const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    const [product, setProduct] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)
    // Getting Products using API
    const getProductData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/products/list')
            if (data.success) {
                setProduct(data.product)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        getProductData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])


    const value ={
        product,
        getProductData,
        token,
        setToken,
        userData,
        loadUserProfileData,
        setUserData,
        backendUrl,
        setProduct,
        currencySymbol
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

    
}

export default AppContextProvider