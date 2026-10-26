import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import Login from './components/Login';
import ChatList from './components/ChatList';

export default function App() {
  const [currentStep, setCurrentStep] = useState('splash');
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: '',
      phone: '',
      avatar: '',
      about: 'Hey there! I am using Vortex.'
    };
  });

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

  useEffect(() => {
    if (userData && userData.phone) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    if (currentStep === 'splash') {
      const timer = setTimeout(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            if (parsed && parsed.phone) {
              setCurrentStep('chatlist');
              return;
            }
          } catch (e) {}
        }
        setCurrentStep('login');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleLoginComplete = (data) => {
    const updated = { ...userData, ...data };
    setUserData(updated);
    try {
      localStorage.setItem('user', JSON.stringify(updated));
    } catch (e) {}
    setCurrentStep('chatlist');
  };

  const handleUpdateUser = (newData) => {
    setUserData(newData);
    try {
      localStorage.setItem('user', JSON.stringify(newData));
    } catch (e) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserData({
      name: '',
      phone: '',
      avatar: '',
      about: 'Hey there! I am using Vortex.'
    });
    setCurrentStep('login');
  };

  if (currentStep === 'splash') {
    return <Splash />;
  }

  if (currentStep === 'login') {
    return <Login onLoginComplete={handleLoginComplete} />;
  }

  if (currentStep === 'chatlist') {
    return <ChatList userData={userData} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />;
  }

  return null;
}