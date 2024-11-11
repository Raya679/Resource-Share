import { createContext, useReducer } from "react";

export const BookDonationsContext = createContext();

export const BookDonationsReducer = (state, action) => {
  switch (action.type) {
    case "SET_BOOK_DONATIONS":
      return {
        bookDonations: action.payload,
      };
    case "CREATE_BOOK_DONATIONS":
      return {
        bookDonations: [action.payload, ...state.bookDonations],
      };
    case "DELETE_BOOK_DONATIONS":
      return {
        bookDonations: state.bookDonations.filter(
          (bkd) => bkd._id !== action.payload._id
        ),
      };
    case "BOOK_BOOK_DONATION":
      return {
        ...state,
        bookDonations: state.bookDonations.map((donation) =>
          donation._id === action.payload._id
            ? { ...donation, booked: true }
            : donation
        ),
      };
    default:
      return state;
  }
};

export const BookDonationsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BookDonationsReducer, {
    bookDonations: null,  
  });

  return (
    <BookDonationsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BookDonationsContext.Provider>
  );
};
