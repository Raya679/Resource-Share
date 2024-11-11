import { createContext, useReducer } from "react";

export const ClothesDonationsContext = createContext();

export const ClothesDonationsReducer = (state, action) => {
  switch (action.type) {
    case "SET_CLOTHES_DONATIONS":
      return {
        clothesDonations: action.payload,
      };
    case "CREATE_CLOTHES_DONATIONS":
      return {
        clothesDonations: [action.payload, ...state.clothesDonations],
      };
    case "DELETE_CLOTHES_DONATIONS":
      return {
        clothesDonations: state.clothesDonations.filter(
          (cld) => cld._id !== action.payload._id
        ),
      };
    case "BOOK_CLOTHES_DONATION":
      return {
        ...state,
        clothesDonations: state.clothesDonations.map((donation) =>
          donation._id === action.payload._id
            ? { ...donation, booked: true }
            : donation
        ),
      };
    default:
      return state;
  }
};

export const ClothesDonationsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ClothesDonationsReducer, {
    clothesDonations: null,  
  });

  return (
    <ClothesDonationsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ClothesDonationsContext.Provider>
  );
};
