// Component: Login
// Description: Ultra-polished fintech authentication screen with fixed 3D cards illustration asset, uniform buttons, and native app feel.

import React, { useState, useEffect } from 'react';
import Onboarding from './Onboarding';

export default function Login({ onGoogleLogin }) {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
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
      setError("To install, tap your browser menu (three dots) and select 'Install app' or 'Add to Home screen'.");
    }
  };

  const handleGoogleClick = (e) => {
    e.preventDefault();
    if (!agreed) {
      setError('Please agree to the Terms of Services and Privacy Policy to continue.');
      return;
    }
    setError('');
    if (onGoogleLogin) {
      onGoogleLogin();
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
      padding: '2.5rem 1.25rem',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      
      <style>{`
        /* --- NATIVE APP FEEL FIXES --- */
        * {
          outline: none !important;
          -webkit-tap-highlight-color: transparent !important;
          -webkit-touch-callout: none !important;
        }

        body, button, div, span, h1, p, label {
          -webkit-user-select: none !important;
          user-select: none !important;
        }

        /* Premium 3D Tilt and Float Animation */
        @keyframes floatAndTilt {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) perspective(1000px) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(3deg) perspective(1000px) rotateX(4deg) rotateY(-4deg);
          }
        }
        .floating-3d-graphic {
          animation: floatAndTilt 5s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        .auth-btn {
          width: 100%;
          max-width: 380px;
          background-color: #121214;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 1rem;
          border-radius: 9999px;
          border: 1px solid #27272a;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .auth-btn:hover {
          background-color: #1a1a1e;
          border-color: #3f3f46;
          transform: translateY(-1px);
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

      {/* Refined Liquid Glass Notice Modal */}
      {error && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#121214',
            border: '1px solid #27272a',
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '320px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)'
          }}>
            <div style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', letterSpacing: '-0.01em' }}>
              Notice Required
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px' }}>
              {error}
            </p>
            <button 
              onClick={() => setError('')}
              style={{
                backgroundColor: '#1a1a1e',
                color: '#ffffff',
                border: '1px solid #3f3f46',
                borderRadius: '9999px',
                padding: '10px 20px',
                fontWeight: '500',
                fontSize: '0.9rem',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.borderColor = '#71717a'}
              onMouseOut={(e) => e.target.style.borderColor = '#3f3f46'}
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
        
        {/* Fixed 3D Fintech Asset Container with Smooth Tilt-Float Animation */}
        <div className="floating-3d-graphic" style={{ marginBottom: '1.5rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src="/cards-illustration.png" 
            alt="Money Tracker 3D Cards" 
            style={{ 
              width: '210px', 
              height: 'auto', 
              filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.75))' 
            }} 
          />
        </div>

        {/* Modern Bold App Title */}
        <h1 style={{ 
          fontSize: '2.15rem', 
          fontWeight: '800', 
          marginBottom: '0.35rem', 
          letterSpacing: '-0.04em',
          background: 'linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Money Tracker
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '2.25rem', lineHeight: '1.5', fontWeight: '400' }}>
          Sign in or create a secure account.
        </p>

        {/* Actions */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          
          {/* Continue with Google Button */}
          <button 
            type="button"
            onClick={handleGoogleClick}
            className="auth-btn"
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.15 21.32 7.22 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.39-1.5-.39-2.24s.14-1.52.39-2.24V6.61H1.18C.43 8.13 0 9.87 0 12s.43 3.87 1.18 5.39l4.09-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.15 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
            </div>
            Continue with Google
          </button>

          {/* Download Money Tracker Button */}
          <button 
            type="button"
            onClick={handleInstallClick}
            className="auth-btn"
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v13m0 0l-4-4m4 4l4-4M2 17v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2" />
              </svg>
            </div>
            Download Money Tracker
          </button>

          {/* Checkbox */}
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
                By signing up or connecting with the services above you agree to our <a href="#" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Terms of Services</a> and acknowledge our <a href="#" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Privacy Policy</a> describing how we handle your personal data.
              </span>
            </label>
          </div>

        </div>

        {/* About Developer link */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '0.85rem',
          marginTop: '2rem',
          width: '100%'
        }}>
          <a 
            href="https://my-portfolio-omega-self-73.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#9ca3af', textDecoration: 'underline' }}
          >
            About Developer
          </a>
        </div>

      </div>

      <div style={{ height: '5px' }}></div>

    </div>
  );
}
