import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [currentStep, setCurrentStep] = useState('splash');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('isAuth') === 'true';
    } catch (e) {
      return false;
    }
  });

  // PWA Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
          console.log('Service worker registered successfully:', reg);
        }).catch((err) => {
          console.log('Service worker registration failed:', err);
        });
      });
    }
  }, []);

  // Splash screen timer logic
  useEffect(() => {
    if (currentStep === 'splash') {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          setCurrentStep('dashboard');
        } else {
          setCurrentStep('login');
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isAuthenticated]);

  const handleGoogleLogin = () => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem('isAuth', 'true');
    } catch (e) {}
    setCurrentStep('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('isAuth');
    } catch (e) {}
    setCurrentStep('login');
  };

  if (currentStep === 'splash') {
    return <Splash />;
  }

  if (currentStep === 'login' || !isAuthenticated) {
    return <Login onGoogleLogin={handleGoogleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
