import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { useAuthContextNGO } from "./hooks/useAuthContextNGO";

//pages
import Home from "./pages/home";
import Signup from "./pages/Donor/signup";
import Login from "./pages/Donor/login";
import SignupNGO from "./pages/NGO/signupNGO";
import LoginNGO from "./pages/NGO/loginNGO";
import DonationsPage from "./pages/NGO/donationsNGO";
import DonateNow from "./pages/Donor/donateNow";
import DonorFoodDonationsDashboard from "./pages/Donor/foodDonations";
import NGOFoodDonationsDashboard from "./pages/NGO/foodDonatedNGO";
import NGOBookedFoodDonationsDashboard from "./pages/NGO/bookedDonationsNGO";

function App() {
  const {donor} = useAuthContext()
  const {ngo} = useAuthContextNGO()

  return (
    <div className="bg-teal-50 h-screen">
      <BrowserRouter>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={!donor ? <Signup/> : <Navigate to="/" /> }/>
          <Route path="/login" element={!donor ? <Login/> : <Navigate to="/" />}/>
          <Route path="/signupNGO" element={!ngo ? <SignupNGO/> : <Navigate to="/" /> }/>
          <Route path="/loginNGO" element={!ngo ? <LoginNGO/> : <Navigate to="/" />}/> 
          <Route path="/donationsNGO" element={ngo? <DonationsPage/> : <Navigate to="/" />}/>
          <Route path="/donateNow" element={donor? <DonateNow/> : <Navigate to="/" />}/>
          <Route path="/donateFood" element={donor? <DonorFoodDonationsDashboard/> : <Navigate to="/" />}/>
          <Route path="/donatedFoodNGO" element={ngo? <NGOFoodDonationsDashboard/> : <Navigate to="/" />}/>
          <Route path="/bookedFoodNGO" element={ngo? <NGOBookedFoodDonationsDashboard/> : <Navigate to="/" />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
