import { Link } from "react-router-dom";
import logo from "../pictures/logo.png";

import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useAuthContextNGO } from "../hooks/useAuthContextNGO";
import { useLogoutNGO } from "../hooks/useLogoutNGO";

const Navbar = () => {
  const { donor } = useAuthContext();
  const { logout } = useLogout();
  const { ngo } = useAuthContextNGO();
  const { logoutNGO } = useLogoutNGO();

  const handleClick = () => {
    logout();
  };

  const handleClickNGO = () => {
    logoutNGO();
  };

  return (
    <header>
      <div className="text-gray-600 text-xl font-bold bg-teal-50 h-14 flex items-center p-10 place-content-between border-b-2 border-teal-400 shadow-md">
        <div>
          <Link to="/">
            <div className="w-2/5 h-1/3">
              <img src={logo} alt="Logo" className="h-full w-full object-contain" />
            </div>
          </Link>
        </div>
        <nav className="flex w-1/2 place-content-around items-center">
          {donor && (
            <>
              <Link to="/" className="hover:text-teal-500 transition duration-300">
                <h1>Home</h1>
              </Link>
              <Link to="/donateNow" className="hover:text-teal-500 transition duration-300">
                <h1>Donate Now</h1>
              </Link>
              <button
                onClick={handleClick}
                className="bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-500 transition duration-300"
              >
                Logout
              </button>
            </>
          )}

          {ngo && (
            <>
              <Link to="/" className="hover:text-teal-500 transition duration-300">
                <h1>Home</h1>
              </Link>
              <Link to="/donationsNGO" className="hover:text-teal-500 transition duration-300">
                <h1>Donations</h1>
              </Link>
              <Link to="/bookedNGO" className="hover:text-teal-500 transition duration-300">
                <h1>Booked Donations</h1>
              </Link>
              <button
                onClick={handleClickNGO}
                className="bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-500 transition duration-300"
              >
                Logout
              </button>
            </>
          )}

          {!donor && !ngo && (
            <>
              <Link to="/" className="hover:text-teal-500 transition duration-300">
                <h1>Home</h1>
              </Link>
              <Link to="/loginNGO" className="hover:text-teal-500 transition duration-300">
                <h1>NGO Login</h1>
              </Link>
              <Link to="/login" className="bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-500 transition duration-300">
                <h1>Donate Now</h1>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
