import { createContext, useReducer } from "react";

export const FoodDonationsContext = createContext();

export const FoodDonationsReducer = (state, action) => {
  switch (action.type) {
    case "SET_FOOD_DONATIONS":
      return {
        foodDonations: action.payload,
      };
    case "CREATE_FOOD_DONATIONS":
      return {
        foodDonations: [action.payload, ...state.foodDonations],
      };
    case "DELETE_FOOD_DONATIONS":
      return {
        foodDonations: state.foodDonations.filter(
          (fdd) => fdd._id !== action.payload._id
        ),
      };
    case "BOOK_FOOD_DONATION":
      return {
        ...state,
        foodDonations: state.foodDonations.map((donation) =>
          donation._id === action.payload._id
            ? { ...donation, booked: true }
            : donation
        ),
      };
    default:
      return state;
  }
};

export const FoodDonationsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(FoodDonationsReducer, {
    foodDonations: null,
  });

  return (
    <FoodDonationsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </FoodDonationsContext.Provider>
  );
};
