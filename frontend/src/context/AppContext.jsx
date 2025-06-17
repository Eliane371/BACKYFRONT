import { createContext } from "react";
import { product } from "../assets/assets";
export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const value ={
        product,
        currencySymbol
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider