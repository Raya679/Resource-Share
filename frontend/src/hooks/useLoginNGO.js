import { useState } from "react";
import { useAuthContextNGO } from "./useAuthContextNGO";

export const useLoginNGO = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContextNGO();

  const loginNGO = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/NGO/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      // console.log('Response Status',response.status)

      const json = await response.json();
      // console.log('Response JSON:',json)

      if (!response.ok) {
        throw new Error(json.error || "Login failed");
      }

      localStorage.setItem("ngo", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
    } catch (error) {
      // console.error('Error during login: ', error)
      setError(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };
  return { loginNGO, isLoading, error };
};