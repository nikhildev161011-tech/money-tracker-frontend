// Component: Login
// Description: Premium authentication screen featuring large floating/tossing dollar coins, PWA app download trigger, black popup error card, and typewriter signature.

import React, { useState, useEffect } from 'react';
import Onboarding from './Onboarding';

export default function Login({ onGoogleLogin }) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallBtn(false);
      }
    } else {
      alert("To install, tap your browser menu (three dots) and select 'Install app' or 'Add to Home screen'.");
    }
  };

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
      overflowX: 'hidden',
      position: 'relative'
    }}>
      
      <style>{`
        @keyframes tossCoin {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-16px) rotate(12deg) scale(1.08);
          }
        }
        .tossing-dollar-1 {
          animation: tossCoin 2.5s ease-in-out infinite;
        }
        .tossing-dollar-2 {
          animation: tossCoin 2.8s ease-in-out infinite 0.4s;
        }
        .tossing-dollar-3 {
          animation: tossCoin 2.2s ease-in-out infinite 0.8s;
        }

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

        .google-btn, .install-btn {
          width: 100%;
          max-width: 380px;
          background-color: #121214;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.95rem 1rem;
          border-radius: 9999px;
          border: 1px solid #27272a;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .google-btn:hover, .install-btn:hover {
          background-color: #1a1a1e;
          border-color: #3f3f46;
          transform: translateY(-1px);
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

      {/* Black Popup Card Modal for Error Messages */}
      {error && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#121214',
            border: '1px solid #27272a',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '320px',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ color: '#ef4444', fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>Notice</div>
            <p style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>
              {error}
            </p>
            <button 
              onClick={() => setError('')}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '10px 20px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}

      <div style={{ height: '5px' }}></div>

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
        
        {/* Large Floating & Tossing Dollar Coins Visual Section */}
        <div style={{ marginBottom: '1.5rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', height: '110px' }}>
          <div className="tossing-dollar-1" style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            <span style={{ color: '#ffffff', fontSize: '28px', fontWeight: 'bold' }}>$</span>
          </div>

          <div className="tossing-dollar-2" style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 15px 35px rgba(16, 185, 129, 0.5)',
            border: '2px solid rgba(255,255,255,0.4)',
            marginTop: '-20px'
          }}>
            <span style={{ color: '#ffffff', fontSize: '36px', fontWeight: 'bold' }}>$</span>
          </div>

          <div className="tossing-dollar-3" style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            <span style={{ color: '#ffffff', fontSize: '28px', fontWeight: 'bold' }}>$</span>
          </div>
        </div>

        {/* App title and subtitle */}
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.35rem', letterSpacing: '-0.025em' }}>
          Money Tracker
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Securely manage your expenses with seamless Google authentication.
        </p>

        {/* Authentication and Download action wrapper */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          
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

          {/* Download Money Tracker Button (Triggers direct app installation prompt without needing 3 dots) */}
          <button 
            type="button"
            onClick={handleInstallClick}
            className="install-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Money Tracker
          </button>

          {/* Professional Checkbox with Permanent Blue Border */}
          <div style={{ textAlign: 'left', width: '100%', marginTop: '0.25rem' }}>
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

        </div>

        {/* Links section */}
        <div style={{
          display: 'flex',
          gap: '20px',
          fontSize: '0.85rem',
          marginTop: '1.5rem',
          alignItems: 'center'
        }}>
          <a 
            href="https://my-portfolio-omega-self-73.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#9ca3af', textDecoration: 'underline' }}
          >
            About Developer
          </a>
          <span style={{ color: '#52525b' }}>|</span>
          <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Thank you for trusting us</span>
        </div>

        {/* Developer signature with infinite typewriter animation positioned at bottom */}
        <div style={{ 
          marginTop: '2rem', 
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

      <div style={{ height: '5px' }}></div>

    </div>
  );
}