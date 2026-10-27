import React, { useEffect } from 'react';

export default function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 5500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      overflow: 'hidden',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      WebkitUserSelect: 'none',
      userSelect: 'none',
      WebkitTouchCallout: 'none',
      WebkitTapHighlightColor: 'transparent'
    }}>
      
      <style>{`
        * {
          -webkit-tap-highlight-color: transparent !important;
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          user-select: none !important;
          outline: none !important;
        }

        @keyframes fadeInScale {
          0% {
            transform: scale(0.9);
            opacity: 0;
            filter: blur(8px);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            filter: blur(0px);
          }
        }

        @keyframes posterRiseText {
          0% {
            transform: translateY(30px) scale(0.95);
            opacity: 0;
            filter: blur(6px);
          }
          100% {
            transform: translateY(0px) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
        }

        .splash-video-container {
          animation: fadeInScale 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          width: 300px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          margin-bottom: 1rem;
          pointer-events: none;
        }

        .poster-title {
          animation: posterRiseText 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s;
          opacity: 0;
          pointer-events: none;
        }
      `}</style>

      <div className="splash-video-container">
        <video 
          src="/splash-animation.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            background: 'transparent',
            pointerEvents: 'none'
          }} 
        />
      </div>

      <div className="poster-title" style={{ textAlign: 'center' }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '2.4rem',
          fontWeight: '900',
          letterSpacing: '-0.04em',
          margin: 0,
          textTransform: 'uppercase',
          textShadow: '0 10px 30px rgba(255, 255, 255, 0.25)',
          background: 'linear-gradient(180deg, #ffffff 40%, #9ca3af 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Money Tracker
        </h1>
        <p style={{
          color: '#38bdf8',
          fontSize: '0.85rem',
          fontWeight: '600',
          letterSpacing: '0.25em',
          margin: '8px 0 0 0',
          textTransform: 'uppercase'
        }}>
          Smart Finance
        </p>
      </div>

    </div>
  );
}
