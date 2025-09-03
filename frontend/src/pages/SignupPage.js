import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hangingLeavesImage from '../assets/leaves.png';

function SignupPage() {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); // To style messages

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setMessage('');
    setIsError(false);

    if (!email || !username || !password || !confirmPassword) {
      setMessage('Please fill in all fields.');
      setIsError(true);
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setIsError(true);
      return;
    }

    try {
      // Fire-and-forget signup request; navigate immediately to OTP page
      fetch('http://localhost:8080/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, confirmPassword }),
      })
        .then(async (res) => {
          const contentType = res.headers.get('content-type') || '';
          const data = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
          if (!res.ok) {
            console.error('Signup error:', data);
          }
        })
        .catch((err) => console.error('Signup request failed:', err));

      navigate('/verify-otp', { state: { email } });
      return;
    } catch (err) {
      console.error(err);
      // Even on failure, still navigate to OTP page per requirement
      navigate('/verify-otp', { state: { email } });
      return;
    }
  };

  return (
    <div
      className="App"
      style={{
        backgroundColor: '#eeebe5ff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Transparent image in top-left corner */}
      <div
        className="corner-leaves"
        style={{
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
        }}
      ></div>

      {/* Header Section */}
      <header
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="logo"
          style={{ fontSize: '24px', fontWeight: 'bold', color: '#3A3833' }}
        >
          Serenify.co
        </div>
      </header>

      {/* Main Content */}
      <main
        className="main-content"
        style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="content-wrapper"
          style={{
            display: 'flex',
            maxWidth: '1200px',
            width: '100%',
            alignItems: 'center',
          }}
        >
          {/* Left Section */}
          <div className="text-section" style={{ flex: 1, paddingRight: '60px' }}>
            <h1
              style={{ fontSize: '48px', color: '#3A3833', marginBottom: '20px' }}
            >
              Create your account.
            </h1>
            <p style={{ fontSize: '18px', color: '#3A3833', lineHeight: '1.6' }}>
              Join our community to start your journey towards tranquility.
            </p>
          </div>

          {/* Right Section (Signup Form) */}
          <form
            onSubmit={handleSignup}
            className="form-section"
            style={{ flex: 1, backgroundColor: 'transparent', padding: '40px', borderRadius: '10px' }}
          >
            {message && (
              <p style={{ color: isError ? '#D8000C' : '#4F8A10', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                {message}
              </p>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="email" style={{ display: 'block', fontSize: '18px', color: '#3A3833', marginBottom: '10px' }}>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.doe@email.com"
                style={{
                  width: '100%', padding: '12px', borderRadius: '5px',
                  border: '1px solid #D1C5B5', backgroundColor: '#F9F5EF',
                  fontSize: '16px', boxSizing: 'border-box', color: '#3A3833'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="username" style={{ display: 'block', fontSize: '18px', color: '#3A3833', marginBottom: '10px' }}>Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="janedoe"
                style={{
                  width: '100%', padding: '12px', borderRadius: '5px',
                  border: '1px solid #D1C5B5', backgroundColor: '#F9F5EF',
                  fontSize: '16px', boxSizing: 'border-box', color: '#3A3833'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="password" style={{ display: 'block', fontSize: '18px', color: '#3A3833', marginBottom: '10px' }}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '12px', borderRadius: '5px',
                  border: '1px solid #D1C5B5', backgroundColor: '#F9F5EF',
                  fontSize: '16px', boxSizing: 'border-box', color: '#3A3833'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '18px', color: '#3A3833', marginBottom: '10px' }}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%', padding: '12px', borderRadius: '5px',
                  border: '1px solid #D1C5B5', backgroundColor: '#F9F5EF',
                  fontSize: '16px', boxSizing: 'border-box', color: '#3A3833'
                }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#A27D4C', color: 'white', border: 'none',
                width: '100%', padding: '15px', borderRadius: '8px',
                cursor: 'pointer', fontSize: '18px', fontWeight: 'bold'
              }}
            >
              Continue
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SignupPage;