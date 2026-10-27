import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [currentStep, setCurrentStep] = useState('splash');
  
  // Save user object securely in state & localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('moneyTrackerUser');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      id: 'default_user_161011', // fallback unique ID for backend transactions
      name: 'Nikhil Gupta'
    };
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
        const isAuth = localStorage.getItem('isAuth') === 'true';
        if (isAuth) {
          setCurrentStep('dashboard');
        } else {
          setCurrentStep('login');
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleGoogleLogin = () => {
    const loggedInUser = {
      id: 'user_' + Date.now(), // Generate unique backend user ID
      name: 'Nikhil Gupta'
    };
    setUser(loggedInUser);
    try {
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('moneyTrackerUser', JSON.stringify(loggedInUser));
    } catch (e) {}
    setCurrentStep('dashboard');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('isAuth');
      localStorage.removeItem('moneyTrackerUser');
    } catch (e) {}
    setCurrentStep('login');
  };

  if (currentStep === 'splash') {
    return <Splash />;
  }

  if (currentStep === 'login') {
    return <Login onGoogleLogin={handleGoogleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
