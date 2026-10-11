import React, { useState, useEffect } from 'react';
import Splash from './components/Splash';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [isSplash, setIsSplash] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('moneyTrackerUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem('moneyTrackerUser');
      }
    }
  }, []);

  const handleAuth = async (formData, isLogin) => {
    const endpoint = isLogin 
      ? 'https://money-tracker-backend-0bhm.onrender.com/api/auth/login' 
      : 'https://money-tracker-backend-0bhm.onrender.com/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        const userData = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email
        };
        setUser(userData);
        localStorage.setItem('moneyTrackerUser', JSON.stringify(userData));
      } else {
        alert(result.message || "Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Authentication Error:", error);
      alert("Unable to connect to the backend server. Please ensure the server is running.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('moneyTrackerUser');
  };

  if (isSplash) {
    return <Splash />;
  }

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
      overflowX: 'hidden'
    }}>
      {!user ? (
        <Login onLogin={handleAuth} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
