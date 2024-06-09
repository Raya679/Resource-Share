import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// components
import Navbar from "./components/navbar";

//pages
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";

function App() {
  const {user} = useAuthContext()

  return (
    <div className="bg-teal-50 h-screen">
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={!user ? <Signup/> : <Navigate to="/" /> }/>
          <Route path="/login" element={!user ? <Login/> : <Navigate to="/" />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
