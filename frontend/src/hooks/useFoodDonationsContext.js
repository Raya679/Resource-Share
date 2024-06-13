import { FoodDonationsContext } from "../context/foodDonationsContext";
import { useContext } from "react";

export const useFoodDonationsContext = () => {
    const context = useContext(FoodDonationsContext)

    if(!context){
        throw Error('useFoodDonationContext must be inside a FoodDonationsContextProvider')
    }
    console.log(context)
    return context
}