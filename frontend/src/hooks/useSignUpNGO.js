import { useState } from "react";
import { useAuthContextNGO } from "./useAuthContextNGO";

export const useSignUpNGO = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContextNGO();

  const signupNGO = async (email, name, NGO_ID, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/NGO/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, NGO_ID, password }),
      });
      // console.log('Response Status',response.status)

      const json = await response.json();
      // console.log('Response JSON:',json)

      if (!response.ok) {
        throw new Error(json.error || "Sign up failed");
      }

      localStorage.setItem("ngo", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
    } catch (error) {
      // console.error('Error during signup: ', error)
      setError(error.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };
  return { signupNGO, isLoading, error };
};
