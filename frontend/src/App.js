import React from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"; 
import OtpVerificationPage from "./pages/OtpVerificationPage";   

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path='/verify-otp' element={<OtpVerificationPage/>} />
      </Routes>
    </Router>
  );
}
export default App;
