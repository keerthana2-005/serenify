import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import hangingLeavesImage from '../assets/leaves.png';

function OtpVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ''; // Email from previous signup page

  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (e, index) => {
    const val = e.target.value.replace(/\D/, ''); // Allow only digits
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Move focus
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    setMessage('');
    setIsError(false);

    if (otp.some((digit) => digit === '')) {
      setMessage('Please enter all OTP digits.');
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join('') }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsError(false);
        setMessage(data.message || 'OTP verified successfully!');
        // Redirect to login or dashboard
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setIsError(true);
        setMessage(data.message || 'OTP verification failed.');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Server is not responding. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch('http://localhost:8080/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || 'OTP resent successfully!');
      setIsError(false);
    } catch (err) {
      setMessage('Could not resend OTP. Try again later.');
      setIsError(true);
    }
  };

  return (
    <div style={{ backgroundColor: '#eeebe5ff', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', position: 'relative', overflowX: 'hidden' }}>
      {/* Top-left leaves */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '450px', height: '450px', backgroundImage: `url(${hangingLeavesImage})`, backgroundSize: 'contain', backgroundPosition: 'top left', backgroundRepeat: 'no-repeat', opacity: 0.3, zIndex: 0 }}></div>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3A3833' }}>Serenify.co</div>
        <nav>
          <Link to="/login" style={{ backgroundColor: '#A27D4C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', textDecoration: 'none' }}>LOGIN →</Link>
        </nav>
      </header>

      {/* Main */}
      <main style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', maxWidth: '1200px', width: '100%', alignItems: 'center' }}>
          {/* Left Text */}
          <div style={{ flex: 1, paddingRight: '60px' }}>
            <h1 style={{ fontSize: '48px', color: '#3A3833', marginBottom: '20px' }}>Verify your account.</h1>
            <p style={{ fontSize: '18px', color: '#3A3833', lineHeight: '1.6' }}>An OTP has been sent to your email. Please enter it below to complete your registration.</p>
          </div>

          {/* Right OTP Form */}
          <div style={{ flex: 1, backgroundColor: 'transparent', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
            {message && <p style={{ color: isError ? '#D8000C' : '#4F8A10', fontWeight: 'bold', marginBottom: '20px' }}>{message}</p>}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={{ width: '60px', height: '60px', textAlign: 'center', fontSize: '24px', borderRadius: '8px', border: '1px solid #D1C5B5', backgroundColor: '#F9F5EF', color: '#3A3833' }}
                />
              ))}
            </div>

            <button onClick={handleVerify} disabled={loading} style={{ backgroundColor: '#A27D4C', color: 'white', border: 'none', width: '100%', padding: '15px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>

            <button onClick={handleResend} style={{ background: 'none', border: 'none', color: '#3A3833', textDecoration: 'underline', cursor: 'pointer' }}>Resend OTP</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OtpVerificationPage;
