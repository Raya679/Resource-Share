import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignUp = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, name, contact,aadharNo, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/donor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, contact,aadharNo, password }),
      });
      // console.log('Response Status',response.status)

      const json = await response.json();
      // console.log('Response JSON:',json)

      if (!response.ok) {
        throw new Error(json.error || "Sign up failed");
      }

      localStorage.setItem("donor", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
    } catch (error) {
      // console.error('Error during signup: ', error)
      setError(error.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };
  return { signup, isLoading, error };
};
