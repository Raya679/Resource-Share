import { Link } from "react-router-dom";
import logo from "../pictures/logo.png";

import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const handleClick = () => {
    logout();
  };
  return (
    <header>
      <div className="text-gray-600 text-xl font-bold bg-teal-50 hover:bg-teal-50 h-14 flex items-center p-10 place-content-between border-b-2 border-teal-400 ">
        <div>
          <Link to="/">
            <div className="w-2/5 h-1/3">
              <img src={logo}></img>
            </div>
          </Link>
        </div>
        <div className="flex w-1/2 place-content-around">
          {user && (
            <>
              <Link to="/">
                <h1>Home</h1>
              </Link>
              <Link to="/about">
                <h1>About</h1>
              </Link>
              <Link to="/contactUs">
                <h1>Contact Us</h1>
              </Link>
              <Link to="/">
                <button onClick={handleClick}>Logout</button>
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link to="/">
                <h1>Home</h1>
              </Link>
              <Link to="/about">
                <h1>About</h1>
              </Link>
              <Link to="/contactUs">
                <h1>Contact Us</h1>
              </Link>
              <Link to="/login">
                <h1>Login</h1>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
