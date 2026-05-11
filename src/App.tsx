import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { isAuthenticated, logout, getCurrentUser } from './services/auth.service';
import type { AuthUser } from './services/auth.service';

/**
 * OptimaAcademia App Entry Point
 * Manages the top-level navigation flow: Landing -> Login -> Dashboard.
 */
const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    if (isAuthenticated()) {
      setCurrentUser(getCurrentUser());
      setView('dashboard');
    } else {
      setView('landing');
    }
  }, []);

  // Simple route guardian: if we try to go to dashboard without auth, go to login
  useEffect(() => {
    if (view === 'dashboard' && !isAuthenticated()) {
      setView('login');
    }
    if ((view === 'login' || view === 'landing') && isAuthenticated()) {
      setView('dashboard');
    }
  }, [view]);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setView('landing');
  };

  // View Switcher logic
  switch (view) {
    case 'landing':
      return <LandingPage onStart={() => setView('login')} />;
    case 'login':
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    case 'dashboard':
      return <DashboardPage onLogout={handleLogout} />;
    default:
      return <LandingPage onStart={() => setView('login')} />;
  }
};

export default App;
