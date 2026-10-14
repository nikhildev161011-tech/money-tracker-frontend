import React, { useEffect } from 'react';

export default function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 3200);

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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      <style>{`
        @keyframes tossAndRise {
          0% {
            transform: translateY(70px) scale(0.3) rotate(-20deg);
            opacity: 0;
          }
          60% {
            transform: translateY(-12px) scale(1.08) rotate(6deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0px) scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes posterRiseText {
          0% {
            transform: translateY(50px) scale(0.85);
            opacity: 0;
            filter: blur(8px);
          }
          60% {
            transform: translateY(-5px) scale(1.03);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: translateY(0px) scale(1);
            opacity: 1;
            filter: blur(0px);
          }
        }

        .dollar-coin-1 {
          animation: tossAndRise 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .dollar-coin-2 {
          animation: tossAndRise 1.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s;
          opacity: 0;
        }
        .dollar-coin-3 {
          animation: tossAndRise 1.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.4s;
          opacity: 0;
        }

        .poster-title {
          animation: posterRiseText 1.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.5s;
          opacity: 0;
        }
      `}</style>

      {/* Center Tossing Dollar Coins */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', marginBottom: '2.5rem' }}>
        
        <div className="dollar-coin-1" style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 30px rgba(16, 185, 129, 0.45)',
          border: '2px solid rgba(255,255,255,0.35)'
        }}>
          <span style={{ color: '#ffffff', fontSize: '30px', fontWeight: '900' }}>$</span>
        </div>

        <div className="dollar-coin-2" style={{
          width: '82px',
          height: '82px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 18px 40px rgba(16, 185, 129, 0.55)',
          border: '2px solid rgba(255,255,255,0.45)',
          marginTop: '-28px'
        }}>
          <span style={{ color: '#ffffff', fontSize: '42px', fontWeight: '900' }}>$</span>
        </div>

        <div className="dollar-coin-3" style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 30px rgba(16, 185, 129, 0.45)',
          border: '2px solid rgba(255,255,255,0.35)'
        }}>
          <span style={{ color: '#ffffff', fontSize: '30px', fontWeight: '900' }}>$</span>
        </div>

      </div>

      {/* Poster Style Bold Rising Title */}
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