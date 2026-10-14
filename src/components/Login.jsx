// Component: Login
// Description: Premium authentication screen featuring realistic cash note drop animation, typewriter signature, and debugging console logs.

import React, { useState } from 'react';
import Onboarding from './Onboarding';

export default function Login({ onGoogleLogin }) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(true);

  // Handle Google Sign-In trigger with debugging log
  const handleGoogleClick = (e) => {
    e.preventDefault();
    console.log("Google button was clicked successfully!");

    if (!agreed) {
      setError('Please agree to the Terms & Conditions and Privacy Policy to continue.');
      return;
    }
    setError('');
    if (onGoogleLogin) {
      onGoogleLogin();
    } else {
      console.error("onGoogleLogin prop is not passed to Login component!");
    }
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
      
      {/* Styles for realistic cash drop animation, permanent blue checkboxes, and typewriter effect */}
      <style>{`
        @keyframes dropInCash {
          0% { transform: translateY(-50px) rotate(-10deg) scale(0.7); opacity: 0; }
          60% { transform: translateY(10px) rotate(3deg) scale(1.05); opacity: 1; }
          100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 1; }
        }
        .animated-cash-note {
          animation: dropInCash 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes floatNote {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        .floating-cash-note {
          animation: floatNote 3.5s ease-in-out infinite 1.2s;
        }

        /* Typewriter animation without blinking cursor line */
        @keyframes typing {
          0% { width: 0; }
          70% { width: 100%; }
          90% { width: 100%; }
          100% { width: 0; }
        }

        .typewriter-text {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: none;
          animation: typing 5s steps(32, end) infinite;
        }

        .google-btn {
          width: 100%;
          background-color: #ffffff;
          color: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.9rem 1rem;
          border-radius: 0.85rem;
          border: none;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(255, 255, 255, 0.15);
        }

        .google-btn:hover {
          background-color: #f4f4f5;
          transform: translateY(-1px);
        }

        .google-btn:active {
          transform: translateY(0);
        }

        .google-btn:disabled {
          background-color: #27272a;
          color: #71717a;
          cursor: not-allowed;
          box-shadow: none;
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
          height: 1.2rem;
          width: 1.2rem;
          background-color: #0c0c0e;
          border: 2px solid #2563eb;
          border-radius: 0.35rem;
          transition: all 0.2s ease;
          flex-shrink: 0;
          margin-top: 0.1rem;
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
          left: 6px;
          top: 2px;
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
        
        {/* Animated Realistic Currency Note Icon */}
        <div className="animated-cash-note" style={{ marginBottom: '1.5rem' }}>
          <div className="floating-cash-note" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90px',
            height: '64px',
            borderRadius: '12px',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            border: '2px solid rgba(37, 99, 235, 0.4)',
            filter: 'drop-shadow(0 15px 25px rgba(37, 99, 235, 0.35))'
          }}>
            <svg 
              width="50" 
              height="34" 
              viewBox="0 0 24 16" 
              fill="none" 
              stroke="#2563eb" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="1" y="1" width="22" height="14" rx="2" fill="rgba(37, 99, 235, 0.08)" />
              <circle cx="12" cy="8" r="3" stroke="#2563eb" strokeWidth="1.5" fill="rgba(37, 99, 235, 0.2)" />
              <path d="M4 5h2M4 11h2M18 5h2M18 11h2" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* App title and subtitle */}
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.35rem', letterSpacing: '-0.025em' }}>
          Money Tracker
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '2rem', lineHeight: '1.5' }}>
          Securely manage your expenses with seamless Google authentication.
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
            marginBottom: '1.25rem',
            textAlign: 'left',
            boxSizing: 'border-box'
          }}>
            {error}
          </div>
        )}

        {/* Authentication action wrapper */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Professional Checkbox with Permanent Blue Border */}
          <div style={{ textAlign: 'left' }}>
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={agreed} 
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  setError('');
                }}
              />
              <span className="checkmark"></span>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: '1.4' }}>
                By continuing, you agree to our <a href="#" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Terms & Conditions</a> and <a href="#" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Privacy Policy</a>.
              </span>
            </label>
          </div>

          {/* Continue with Google Button */}
          <button 
            type="button"
            onClick={handleGoogleClick}
            disabled={!agreed}
            className="google-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.22 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.39-1.5-.39-2.24s.14-1.52.39-2.24V6.61H1.18C.43 8.13 0 9.87 0 12s.43 3.87 1.18 5.39l4.09-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.15 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            Continue with Google
          </button>

        </div>

        {/* Developer signature with infinite typewriter animation */}
        <div style={{ 
          marginTop: '3rem', 
          fontSize: '0.8rem', 
          color: '#9ca3af',
          letterSpacing: '0.03em',
          fontWeight: '500',
          height: '24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div className="typewriter-text">
            Designed & Developed by <span style={{ color: '#ffffff', fontWeight: '700' }}>Nikhil Gupta</span>
          </div>
        </div>

      </div>

      <div style={{ height: '10px' }}></div>

    </div>
  );
}