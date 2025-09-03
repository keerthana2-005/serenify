import React from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"; 
import OtpVerificationPage from "./pages/OtpVerificationPage";   
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path='/verify-otp' element={<OtpVerificationPage/>} />
        <Route path='/profile' element={<ProfilePage/>} />
      </Routes>
    </Router>
  );
}
export default App;
