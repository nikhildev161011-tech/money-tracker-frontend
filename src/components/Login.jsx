// Component: Login
// Description: Clean authentication screen with onboarding introduction step and login/signup flow.

import React, { useState, useEffect } from 'react';
import Onboarding from './Onboarding';

export default function Login({ onLogin }) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [customAlert, setCustomAlert] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    securityQuestion: 'What is your favourite month',
    securityAnswer: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } else {
      setCustomAlert("To install the app, tap your browser's menu (three dots) at the top right and select 'Install app' or 'Add to Home screen'.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;

    if (formData.password.length < 6) {
      setError('Password is too short! It must be at least 6 characters long.');
      return;
    }
    if (formData.password.length > 15) {
      setError('Password is too long! Maximum 15 characters are allowed.');
      return;
    }

    onLogin(formData, isLogin);
  };

  if (showOnboarding) {
    return <Onboarding onFinish={() => setShowOnboarding(false)} />;
  }

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2rem 1.25rem',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden'
    }}>
      
      {/* Custom In-App Alert Modal */}
      {customAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '320px',
            backgroundColor: '#111115',
            border: '1px solid #27272a',
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            color: '#ffffff'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#3b82f6' }}>
              Money Tracker
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              {customAlert}
            </p>
            <button 
              onClick={() => setCustomAlert(null)}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: '600',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Styles for animations, custom inputs and checkbox */}
      <style>{`
        @keyframes floatWallet {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }
        .animated-wallet {
          animation: floatWallet 3s ease-in-out infinite;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0px 1000px #0c0c0e inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .custom-input {
          width: 100%;
          background-color: #0c0c0e;
          color: #ffffff;
          padding: 0.85rem 2.75rem 0.85rem 2.75rem;
          border-radius: 0.85rem;
          border: 1px solid #222226;
          font-size: 0.95rem;
          box-sizing: border-box;
          transition: all 0.25s ease;
        }

        .custom-input:focus {
          border-color: #2563eb;
          outline: none;
          background-color: #111115;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .custom-input::placeholder {
          color: #52525b;
        }

        .checkbox-container {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
          text-align: left;
        }

        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          position: relative;
          height: 1.25rem;
          width: 1.25rem;
          background-color: #0c0c0e;
          border: 2px solid #3b82f6;
          border-radius: 0.35rem;
          transition: all 0.2s ease;
          flex-shrink: 0;
          margin-top: 0.1rem;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
        }

        .checkbox-container:hover input ~ .checkmark {
          border-color: #60a5fa;
          box-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
        }

        .checkbox-container input:checked ~ .checkmark {
          background-color: #2563eb;
          border-color: #2563eb;
          transform: scale(1.05);
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .checkbox-container input:checked ~ .checkmark:after {
          display: block;
        }

        .checkbox-container .checkmark:after {
          left: 7px;
          top: 3px;
          width: 4px;
          height: 9px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      `}</style>

      <div style={{ height: '10px' }}></div>

      {/* Main container */}
      <div style={{
        width: '100%',
        maxWidth: '390px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        margin: 'auto 0'
      }}>
        
        {/* Animated wallet icon */}
        <div className="animated-wallet" style={{
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 15px 25px rgba(37, 99, 235, 0.35))'
        }}>
          <svg 
            width="72" 
            height="72" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#2563eb" 
            strokeWidth="1.75" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
            <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
          </svg>
        </div>

        {/* App title and subtitle */}
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.35rem', letterSpacing: '-0.025em' }}>
          Money Tracker
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          {isLogin ? "Welcome back! Please enter your details." : "Create your secure personal account."}
        </p>

        {/* Error message box */}
        {error && (
          <div style={{
            width: '100%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            fontSize: '0.82rem',
            marginBottom: '1rem',
            textAlign: 'left',
            boxSizing: 'border-box'
          }}>
            {error}
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          
          {/* Name field (Signup only) */}
          {!isLogin && (
            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.35rem', fontWeight: '500' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '14px', color: '#52525b', pointerEvents: 'none' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter your full name" 
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="custom-input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '1rem' }}
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.35rem', fontWeight: '500' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '14px', color: '#52525b', pointerEvents: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <input 
                type="email" 
                name="email" 
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleChange}
                required
                className="custom-input"
                style={{ paddingLeft: '2.75rem', paddingRight: '1rem' }}
              />
            </div>
          </div>

          {/* Password field with show/hide toggle */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: '500' }}>Password</label>
              <span style={{ fontSize: '0.7rem', color: '#52525b' }}>6 to 15 characters</span>
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '14px', color: '#52525b', pointerEvents: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Enter your password" 
                value={formData.password}
                onChange={handleChange}
                required
                className="custom-input"
                style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '12px',
                  background: 'none',
                  border: 'none',
                  color: '#52525b',
                  cursor: 'pointer',
                  padding: '2px'
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          {/* Security question fields (Signup only) */}
          {!isLogin && (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.35rem', fontWeight: '500' }}>Security Question (For Password Recovery)</label>
                <div style={{
                  width: '100%',
                  backgroundColor: '#0c0c0e',
                  border: '1px solid #222226',
                  borderRadius: '0.85rem',
                  padding: '0.85rem 1rem',
                  color: '#d4d4d8',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxSizing: 'border-box'
                }}>
                  <span style={{ color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </span>
                  <span>What is your favourite month?</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.35rem', fontWeight: '500' }}>Security Answer</label>
                <input 
                  type="text" 
                  name="securityAnswer" 
                  placeholder="e.g., Enter your favourite month" 
                  value={formData.securityAnswer}
                  onChange={handleChange}
                  required={!isLogin}
                  className="custom-input"
                  style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                />
              </div>
            </>
          )}

          {/* Professional Animated Checkbox for Terms and Conditions */}
          <div style={{ marginTop: '0.25rem' }}>
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: '1.4' }}>
                By continuing, you agree to our <a href="#" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Terms & Conditions</a> and <a href="#" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Privacy Policy</a>.
              </span>
            </label>
          </div>

          {/* Submit button */}
          <button 
            type="submit"
            disabled={!agreed}
            style={{
              width: '100%',
              backgroundColor: agreed ? '#2563eb' : '#18181b',
              color: agreed ? '#ffffff' : '#52525b',
              fontWeight: '600',
              padding: '0.9rem 1rem',
              borderRadius: '0.85rem',
              border: 'none',
              cursor: agreed ? 'pointer' : 'not-allowed',
              fontSize: '0.95rem',
              marginTop: '0.5rem',
              transition: 'all 0.2s ease',
              boxShadow: agreed ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'none'
            }}
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>

        </form>

        {/* Toggle between login and signup */}
        <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#9ca3af' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              fontWeight: '600',
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.85rem',
              marginLeft: '0.25rem'
            }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>

        {/* Direct Download App Button */}
        <button 
          type="button"
          onClick={handleInstallClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            width: '100%',
            maxWidth: '280px',
            backgroundColor: '#0c0c0e',
            border: '1px solid #2563eb',
            color: '#ffffff',
            padding: '0.75rem 1rem',
            borderRadius: '0.85rem',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '1.75rem',
            marginBottom: '0.75rem',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            boxSizing: 'border-box'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Download Money Tracker App</span>
        </button>

        {/* Developer signature */}
        <div style={{ 
          marginTop: '0.5rem', 
          fontSize: '0.8rem', 
          color: '#9ca3af',
          letterSpacing: '0.05em',
          fontWeight: '500'
        }}>
          Designed & Developed by <span style={{ color: '#3b82f6', fontWeight: '600' }}>Nikhil Gupta</span>
        </div>

      </div>

      <div style={{ height: '10px' }}></div>

    </div>
  );
}
