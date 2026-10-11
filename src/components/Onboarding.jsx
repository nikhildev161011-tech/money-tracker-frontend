/**
 * Component: Onboarding
 * Description: Renders the multi-step slider/carousel without circular borders,
 *              featuring realistic animated icons, Skip/Next controls, and clean completion.
 */

import React, { useState } from 'react';

export default function Onboarding({ onFinish }) {
  const [currentStep, setCurrentStep] = useState(0);

  // ऑनबोर्डिंग स्लाइड्स (रियलिस्टिक मनी और चार्ट आइकॉन्स के साथ)
  const slides = [
    {
      title: "Record Daily Spending",
      description: "Easily log your daily spending and organize your spending habits.",
      icon: (
        <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <path d="M6 15h2" />
          <path d="M10 15h4" />
        </svg>
      )
    },
    {
      title: "Smart Categories",
      description: "Sort your spending into categories for easy viewing.",
      icon: (
        <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
    {
      title: "Spending Insights",
      description: "Get a clear view of your spending habits with intuitive charts.",
      icon: (
        <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 21H3V3" />
          <path d="M22 7l-5 5-5-5-3 3" />
        </svg>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (typeof onFinish === 'function') {
        onFinish();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (typeof onFinish === 'function') {
      onFinish();
    }
  };

  const slide = slides[currentStep];

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2rem 1.5rem',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden'
    }}>
      
      {/* CSS Animations for smooth floating icons and fade-in */}
      <style>{`
        @keyframes floatIcon {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.06); }
          100% { transform: translateY(0px) scale(1); }
        }
        .animated-icon {
          animation: floatIcon 3s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-container {
          animation: fadeIn 0.4s ease-in-out;
        }
      `}</style>

      {/* Top Header: Skip Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <button 
          onClick={handleSkip}
          style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          Skip
        </button>
      </div>

      {/* Center Content: Borderless Animated Icon & Text */}
      <div className="slide-container" style={{
        width: '100%',
        maxWidth: '380px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        
        {/* बिना किसी बॉर्डर के बड़ा, रियलिस्टिक और एनिमेटेड आइकॉन */}
        <div className="animated-icon" style={{
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 15px 25px rgba(16, 185, 129, 0.35))'
        }}>
          {slide.icon}
        </div>

        {/* Title and Description */}
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>
          {slide.title}
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.5', padding: '0 1rem' }}>
          {slide.description}
        </p>

      </div>

      {/* Bottom Footer: Dots Indicator & Action Buttons */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        paddingBottom: '1rem'
      }}>
        
        {/* Dots Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          {slides.map((_, index) => (
            <div 
              key={index}
              style={{
                width: currentStep === index ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: currentStep === index ? '#10b981' : '#374151',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Action Buttons (Back & Next) */}
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          {currentStep > 0 && (
            <button 
              onClick={handleBack}
              style={{
                flex: 1,
                backgroundColor: '#111827',
                color: '#ffffff',
                fontWeight: '600',
                padding: '0.9rem 1rem',
                borderRadius: '1rem',
                border: '1px solid #1f2937',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              Back
            </button>
          )}

          <button 
            onClick={handleNext}
            style={{
              flex: 2,
              backgroundColor: '#ffffff',
              color: '#000000',
              fontWeight: '600',
              padding: '0.9rem 1rem',
              borderRadius: '1.25rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(255, 255, 255, 0.15)'
            }}
          >
            {currentStep === slides.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>

      </div>

    </div>
  );
}