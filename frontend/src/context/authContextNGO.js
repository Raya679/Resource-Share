import { createContext, useReducer, useEffect } from "react";

export const AuthContextNGO = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ngo: action.payload };
    case "LOGOUT":
      return { ngo: null };
    default:
      return state;
  }
};

export const AuthContextNGOProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    ngo: null,
  });

  useEffect(() => {
    const ngo = JSON.parse(localStorage.getItem("ngo"));

    if (ngo) {
      dispatch({ type: "LOGIN", payload: ngo });
    }
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContextNGO.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContextNGO.Provider>
  );
};
