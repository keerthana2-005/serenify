import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// This path assumes 'LoginPage.js' and the 'assets' folder are both inside 'src'
import hangingLeavesImage from '../assets/leaves.png';


function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(''); // email or username
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!identifier || !password) {
      setMessage('Please enter email/username and password.');
      setIsError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json().catch(() => ({ message: 'Unexpected server response' }));
      if (res.ok) {
        setIsError(false);
        // Optionally store user in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/profile');
      } else {
        setIsError(true);
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage('Unable to reach server.');
    } finally {
      setLoading(false);
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
        opacity: 0.4,
        zIndex: 0,
      }}></div>

      {/* Header Section */}
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', position: 'relative', zIndex: 1 }}>
        <div className="logo" style={{ fontSize: '26px', fontWeight: 'bold', color: '#3A3833' }}>
          Serenify.co
        </div>
        <nav>
          <Link to="/signup" style={{ 
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
            SIGN UP <span style={{ fontSize: '18px' }}>→</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 1 }}>
        <div className="content-wrapper" style={{ display: 'flex', maxWidth: '1200px', width: '100%', alignItems: 'center' }}>
          
          {/* Left Section */}
          <div className="text-section" style={{ flex: 1, paddingRight: '60px' }}>
            <h1 style={{ fontSize: '48px', color: '#3A3833', marginBottom: '20px' }}>Login to your account.</h1>
            <p style={{ fontSize: '18px', color: '#3A3833', lineHeight: '1.6' }}>
              Sign up if you are new to this website.
            </p>
          </div>

          {/* Right Section (Form) */}
          <form onSubmit={handleLogin} className="form-section" style={{ flex: 1, backgroundColor: 'transparent', padding: '40px', borderRadius: '10px' }}>
            {message && (
              <p style={{ color: isError ? '#D8000C' : '#4F8A10', fontWeight: 'bold', marginBottom: '20px' }}>{message}</p>
            )}
            <div style={{ marginBottom: '30px' }}>
              <label htmlFor="identifier" style={{ display: 'block', fontSize: '18px', color: '#3A3833', marginBottom: '10px' }}>Email or Username</label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="jane.doe@email.com or janedoe"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '5px',
                  border: '1px solid #D1C5B5',
                  backgroundColor: '#F9F5EF',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  color: '#3A3833'
                }}
              />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label htmlFor="password" style={{ display: 'block', fontSize: '18px', color: '#3A3833', marginBottom: '10px' }}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '5px',
                  border: '1px solid #D1C5B5',
                  backgroundColor: '#F9F5EF',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  color: '#3A3833'
                }}
              />
            </div>
            <button type="submit" disabled={loading} style={{ backgroundColor: '#4C7A78', color: 'white', border: 'none', padding: '15px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {loading ? '...' : '→'}
            </button>
          </form>
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
      `}</style>
    </div>
  );
}

export default LoginPage;

