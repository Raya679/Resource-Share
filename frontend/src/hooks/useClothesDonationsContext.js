import { ClothesDonationsContext } from "../context/clothesDonationsContext";
import { useContext } from "react";

export const useClothesDonationsContext = () => {
    const context = useContext(ClothesDonationsContext)

    if(!context){
        throw Error('useClothesDonationContext must be inside a ClothesDonationsContextProvider')
    }
    console.log(context)
    return context
}