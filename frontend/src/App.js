import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// components
import Navbar from "./components/navbar";

//pages
import Home from "./pages/home";

function App() {
  return (
    <div className="bg-teal-50 h-screen">
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
