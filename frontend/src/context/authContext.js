import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { donor: action.payload };
    case "LOGOUT":
      return { donor: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    donor: null,
  });

  useEffect(() => {
    const donor = JSON.parse(localStorage.getItem("donor"));

    if (donor) {
      dispatch({ type: "LOGIN", payload: donor });
    }
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
