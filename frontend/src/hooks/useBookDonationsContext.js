import { BookDonationsContext } from "../context/bookDonationsContext";
import { useContext } from "react";

export const useBookDonationsContext = () => {
    const context = useContext(BookDonationsContext)

    if(!context){
        throw Error('useBookDonationContext must be inside a BookDonationsContextProvider')
    }
    console.log(context)
    return context
}