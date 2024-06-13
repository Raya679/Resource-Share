import { useAuthContextNGO } from "./useAuthContextNGO";

export const useLogoutNGO = () => {
  const { dispatch } = useAuthContextNGO();

  const logoutNGO = () => {
    localStorage.removeItem("ngo");
    dispatch({ type: "LOGOUT" });
  };

  return { logoutNGO };
};
