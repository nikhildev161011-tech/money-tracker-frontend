import React, { useState, useEffect } from 'react';

export default function Onboarding({ onFinish }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const assets = ['/credit-cards.png', '/cash-stack.png', '/financial-growth.png'];
    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const onboardingSlides = [
    {
      id: 'step-credit-cards',
      title: "Record Daily Spending",
      description: "Easily log your daily spending and organize your spending habits.",
      image: "/credit-cards.png"
    },
    {
      id: 'step-cash-stack',
      title: "Smart Categories",
      description: "Sort your spending into categories for easy viewing.",
      image: "/cash-stack.png"
    },
    {
      id: 'step-financial-growth',
      title: "Spending Insights",
      description: "Get a clear view of your spending habits with intuitive charts.",
      image: "/financial-growth.png"
    }
  ];

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentStep < onboardingSlides.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (typeof onFinish === 'function') {
        onFinish();
      }
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onFinish === 'function') {
      onFinish();
    }
  };

  const activeSlide = onboardingSlides[currentStep];

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
      overflowX: 'hidden',
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

        @keyframes floatEffect {
          0% { transform: translateY(0px) scale(1) rotate(0deg); }
          50% { transform: translateY(-10px) scale(1.03) rotate(0.5deg); }
          100% { transform: translateY(0px) scale(1) rotate(0deg); }
        }
        .onboarding-asset-anim {
          animation: floatEffect 4s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        @keyframes contentFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .onboarding-slide-wrapper {
          animation: contentFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Top Header: Skip Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <button 
          type="button"
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

      <div key={activeSlide.id} className="onboarding-slide-wrapper" style={{
        width: '100%',
        maxWidth: '380px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        
        <div className="onboarding-asset-anim" style={{
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.8))',
          minHeight: '180px'
        }}>
          <img 
            src={activeSlide.image} 
            alt={activeSlide.title} 
            style={{ 
              width: '180px', 
              height: 'auto', 
              objectFit: 'contain' 
            }} 
          />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>
          {activeSlide.title}
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.5', padding: '0 1rem' }}>
          {activeSlide.description}
        </p>

      </div>

      <div style={{
        width: '100%',
        maxWidth: '380px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        paddingBottom: '1rem'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          {onboardingSlides.map((_, index) => (
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

        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          {currentStep > 0 && (
            <button 
              type="button"
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
            type="button"
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
            {currentStep === onboardingSlides.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>

      </div>

    </div>
  );
}
