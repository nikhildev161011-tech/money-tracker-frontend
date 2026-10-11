/**
 * Component: Splash
 * Description: Renders the initial dark-themed splash screen with a large, 
 *              ultra-premium glowing and floating wallet animation.
 */

import React from 'react';

export default function Splash() {
  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#000000', // एकदम डार्क ब्लैक बैकग्राउंड
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      overflow: 'hidden'
    }}>
      
      {/* मॉडर्न और प्रीमियम पल्स व ग्लोइंग एनिमेशन */}
      <style>{`
        @keyframes premiumPulse {
          0% { 
            transform: scale(0.92) translateY(0px); 
            filter: drop-shadow(0 0 15px rgba(37, 99, 235, 0.3));
          }
          50% { 
            transform: scale(1.08) translateY(-10px); 
            filter: drop-shadow(0 0 45px rgba(59, 130, 246, 0.7));
          }
          100% { 
            transform: scale(0.92) translateY(0px); 
            filter: drop-shadow(0 0 15px rgba(37, 99, 235, 0.3));
          }
        }
        .premium-splash-wallet {
          animation: premiumPulse 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* बड़ा और प्रीमियम एनिमेटेड वॉलेट आइकॉन */}
      <div className="premium-splash-wallet" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg 
          width="110" 
          height="110" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#3b82f6" 
          strokeWidth="1.75" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
          <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
        </svg>
      </div>

    </div>
  );
}