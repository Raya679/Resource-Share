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
import NGODonationsDashboard from "./pages/NGO/bookedDonationsNGO";

import DonorBookDonationsDashboard from "./pages/Donor/bookDonations";
import NGOBookDonationsDashboard from "./pages/NGO/bookDonatedNGO";

import DonorClothesDonationsDashboard from "./pages/Donor/clothesDonations";
import NGOClothesDonationsDashboard from "./pages/NGO/clothesDonatedNGO";


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
          
          <Route path="/bookedNGO" element={ngo? <NGODonationsDashboard/> : <Navigate to="/" />}/>

          <Route path="/donateFood" element={donor? <DonorFoodDonationsDashboard/> : <Navigate to="/" />}/>
          <Route path="/donatedFoodNGO" element={ngo? <NGOFoodDonationsDashboard/> : <Navigate to="/" />}/>
          
          <Route path="/donateBook" element={donor? <DonorBookDonationsDashboard/> : <Navigate to="/" />}/>
          <Route path="/donatedBookNGO" element={ngo? <NGOBookDonationsDashboard/> : <Navigate to="/" />}/>

          <Route path="/donateClothes" element={donor? <DonorClothesDonationsDashboard/> : <Navigate to="/" />}/>
          <Route path="/donatedClothesNGO" element={ngo? <NGOClothesDonationsDashboard/> : <Navigate to="/" />}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
