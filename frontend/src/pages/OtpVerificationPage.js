import React from 'react';
import { Link } from 'react-router-dom';
// This path assumes 'OtpVerificationPage.js' and the 'assets' folder are both inside 'src'
import hangingLeavesImage from '../assets/leaves.png';


function OtpVerificationPage() {

  // A little JS to auto-focus the next input box
  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    // Move to next input if a character is entered
    if (value.length === 1 && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
    // Move to previous input if backspace is pressed on an empty input
    if (value.length === 0 && e.key === 'Backspace' && index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) {
            prevInput.focus();
        }
    }
  };

  return (
    <div className="App" style={{ backgroundColor: '#eeebe5ff', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Transparent image positioned in the top-left corner */}
      <div className="corner-leaves" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '450px',
        height: '450px',
        backgroundImage: `url(${hangingLeavesImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'top left',
        backgroundRepeat: 'no-repeat',
        opacity: 0.3,
        zIndex: 0,
      }}></div>

      {/* Header Section */}
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', position: 'relative', zIndex: 1 }}>
        <div className="logo" style={{ fontSize: '24px', fontWeight: 'bold', color: '#3A3833' }}>
          Serenify.co
        </div>
        <nav>
          <Link to="/login" style={{ 
            backgroundColor: '#A27D4C', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            fontWeight: 'bold',
            textDecoration: 'none'
          }}>
            LOGIN <span style={{ fontSize: '18px' }}>→</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 1 }}>
        <div className="content-wrapper" style={{ display: 'flex', maxWidth: '1200px', width: '100%', alignItems: 'center' }}>
          
          {/* Left Section */}
          <div className="text-section" style={{ flex: 1, paddingRight: '60px' }}>
            <h1 style={{ fontSize: '48px', color: '#3A3833', marginBottom: '20px' }}>Verify your account.</h1>
            <p style={{ fontSize: '18px', color: '#3A3833', lineHeight: '1.6' }}>
              An OTP has been sent to your email. Please enter it below to complete your registration.
            </p>
          </div>

          {/* Right Section (OTP Form) */}
          <div className="form-section" style={{ flex: 1, backgroundColor: 'transparent', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
            <label htmlFor="otp" style={{ display: 'block', fontSize: '18px', color: '#3A3833', marginBottom: '20px' }}>Enter OTP</label>
            
            {/* OTP Input Boxes */}
            <div className="otp-inputs" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
              {[...Array(4)].map((_, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpChange(e, index)} // Added onKeyDown for backspace
                  style={{
                    width: '60px',
                    height: '60px',
                    textAlign: 'center',
                    fontSize: '24px',
                    borderRadius: '8px',
                    border: '1px solid #D1C5B5',
                    backgroundColor: '#F9F5EF',
                    color: '#3A3833',
                    boxSizing: 'border-box',
                  }}
                />
              ))}
            </div>

            <button style={{ backgroundColor: '#A27D4C', color: 'white', border: 'none', width: '100%', padding: '15px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
              Verify Account
            </button>

            <a href="#" style={{ color: '#3A3833', textDecoration: 'underline', cursor: 'pointer' }}>
              Resend OTP
            </a>
          </div>
        </div>
      </main>

      {/* Background Shapes and Logo */}
      <div className="background-decorations" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '200px',
          backgroundColor: '#D1C5B5',
          borderRadius: '50% 0 0 50% / 100% 0 0 0',
          transform: 'translateX(50%)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '150px',
          backgroundColor: '#E8C7C9',
          borderRadius: '0 0 50% 50% / 0 0 100% 100%',
          transform: 'translateY(50%)'
        }}></div>
        <div className="fingerprint-logo" style={{
          position: 'absolute',
          bottom: '50px', 
          left: '80px', 
          width: '200px', 
          height: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            backgroundColor: 'rgba(172, 172, 172, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(circle, transparent 20%, rgba(172, 172, 172, 0.3) 20%, rgba(172, 172, 172, 0.3) 25%, transparent 25%)',
              backgroundSize: '15px 15px',
              transform: 'scale(1.2)'
            }}></div>
            <span style={{
              fontFamily: 'cursive',
              fontSize: '48px',
              color: '#F9F5EF',
              zIndex: 1, 
              position: 'relative',
              left: '-5px',
              top: '5px'
            }}>Serenify</span>
          </div>
        </div>
      </div>

      {/* --- RESPONSIVE STYLES --- */}
      <style>{`
        @media (max-width: 1024px) {
          .content-wrapper {
            flex-direction: column;
            gap: 30px;
            max-width: 600px;
          }
          .text-section {
            padding-right: 0;
            text-align: center;
          }
          .text-section h1 {
            font-size: 40px !important;
          }
          .form-section {
            width: 100%;
          }
          .corner-leaves {
            width: 350px;
            height: 350px;
          }
        }

        @media (max-width: 768px) {
          .page-header, .main-content {
            padding: 20px;
          }
          .text-section h1 {
            font-size: 32px !important;
          }
          .text-section p {
            font-size: 16px !important;
          }
          .logo {
            font-size: 22px !important;
          }
          .fingerprint-logo {
            left: 20px;
            bottom: 20px;
            transform: scale(0.8);
          }
          .corner-leaves {
            width: 250px;
            height: 250px;
            opacity: 0.3;
          }
        }

        @media (max-width: 480px) {
          .otp-inputs {
            gap: 10px !important;
          }
          .otp-inputs input {
            width: 45px !important;
            height: 45px !important;
            font-size: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default OtpVerificationPage;

