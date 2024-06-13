import { AuthContextNGO } from "../context/authContextNGO";
import { useContext } from "react";

export const useAuthContextNGO = () => {
  const context = useContext(AuthContextNGO);

  if (!context) {
    throw Error("useAuthContextNGO must be used inside AuthContextNGOProvider");
  }

  return context;
};