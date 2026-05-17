import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import SyncHub from './features/sync/SyncHub';
import ScheduleManager from './features/schedule/ScheduleManager';
import SwapMarket from './features/marketplace/SwapMarket';
import FormalizationCertificate from './features/swaps/FormalizationCertificate';
import US08SeccionesDisponibles from './pages/US08SeccionesDisponibles';
import US09IntercambioSecciones from './pages/US09IntercambioSecciones';
import US13Sugerencias from './pages/US13Sugerencias';
import ProfileSettings from './features/profile/ProfileSettings';
import { AuthModal } from './features/auth';

type ViewType = 'landing' | 'sync' | 'schedule' | 'inbox' | 'formalize' | 'profile' | 'sections' | 'swaps' | 'suggestions';

interface User {
  name: string;
  email: string;
  role: string;
}

/**
 * OptimaAcademia App Entry Point
 * Manages the top-level navigation flow: Landing -> Login -> Dashboard.
 */
const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  React.useEffect(() => {
    const handleSSORedirect = async () => {
      const hash = window.location.hash;
      
      // 1. Google OAuth Implicit Redirect Detection
      if (hash.includes('access_token=') || hash.includes('google_token=')) {
        try {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token') || params.get('google_token');
          if (!accessToken) return;

          let email = 'invitado.google@gmail.com';
          let name = 'Usuario Google';

          try {
            // Attempt to fetch profile info from Google's UserInfo API using the real access token
            const profileResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
            if (profileResponse.ok) {
              const profile = await profileResponse.json();
              email = profile.email || email;
              name = profile.name || name;
            }
          } catch (e) {
            console.warn('Google UserInfo API fetch failed, proceeding with fallback parsing:', e);
          }

          const { authService } = await import('./services/api');
          const res = await authService.googleCallback(email, name);

          if (res.success && res.data) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('studentId', res.data.student.id);
            localStorage.setItem('studentName', res.data.student.nombreCompleto);
            localStorage.setItem('studentEmail', res.data.student.emailInstitucional);

            setUser({
              name: res.data.student.nombreCompleto,
              email: res.data.student.emailInstitucional,
              role: 'Usuario General (Google)',
            });
            setView('sync');
            
            window.history.replaceState(null, '', window.location.pathname);
          }
        } catch (err: any) {
          console.error('Google SSO Redirection Error:', err);
          alert('Error al iniciar sesión con Google: ' + err.message);
          window.history.replaceState(null, '', window.location.pathname);
        }
        return;
      }

      // 2. Microsoft SSO Redirect Detection
      if (hash.includes('id_token=')) {
        try {
          const params = new URLSearchParams(hash.substring(1));
          const idToken = params.get('id_token');
          if (!idToken) return;

          const base64Url = idToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            window.atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const payload = JSON.parse(jsonPayload);

          const email = payload.email || payload.preferred_username || payload.upn;
          const name = payload.name || (email ? email.split('@')[0]
            .split(/[._-]/)
            .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ') : 'Estudiante');

          if (!email) throw new Error('No se pudo extraer el correo institucional de la cuenta Microsoft.');

          const { authService } = await import('./services/api');
          const res = await authService.ssoCallback(email, name);

          if (res.success && res.data) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('studentId', res.data.student.id);
            localStorage.setItem('studentName', res.data.student.nombreCompleto);
            localStorage.setItem('studentEmail', res.data.student.emailInstitucional);

            setUser({
              name: res.data.student.nombreCompleto,
              email: res.data.student.emailInstitucional,
              role: 'Estudiante Ingeniería',
            });
            setView('sync');
            
            window.history.replaceState(null, '', window.location.pathname);
          }
        } catch (err: any) {
          console.error('SSO Redirection Error:', err);
          alert('Error al iniciar sesión con Microsoft: ' + err.message);
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };

    handleSSORedirect();

    if (window.location.pathname === '/reset-password') {
      setIsAuthOpen(true);
    }
  }, []);

  const handleStart = () => {
    if (user) {
      setView('sync');
    } else {
      setIsAuthOpen(true);
    }
  };

  if (view === 'landing') {
    return (
      <>
        <LandingPage 
          onStart={handleStart} 
          onLoginClick={() => setIsAuthOpen(true)} 
        />
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setView('sync');
          }} 
        />
      </>
    );
  }

  const handleNavigate = (id: string) => {
    if (id === 'academic') setView('sync');
    else if (id === 'sections') setView('sections');
    else if (id === 'swaps') setView('swaps');
    else if (id === 'scheduler') setView('schedule');
    else if (id === 'marketplace') setView('inbox');
    else if (id === 'documents') setView('formalize');
    else if (id === 'profile') setView('profile');
    else if (id === 'suggestions') setView('suggestions');
    else setView('sync'); 
  };

  return (
    <DashboardLayout 
      user={user}
      activeSection={
        view === 'sync' ? 'academic' : 
        view === 'sections' ? 'sections' :
        view === 'swaps' ? 'swaps' :
        view === 'schedule' ? 'scheduler' : 
        view === 'inbox' ? 'marketplace' : 
        view === 'formalize' ? 'documents' :
        view === 'suggestions' ? 'suggestions' : 'profile'
      } 
      onNavigate={handleNavigate}
      onLogout={() => {
        setUser(null);
        setView('landing');
      }}
    >
      {view === 'sync' && <SyncHub />}
      {view === 'sections' && <US08SeccionesDisponibles />}
      {view === 'swaps' && <US09IntercambioSecciones />}
      {view === 'suggestions' && <US13Sugerencias />}
      {view === 'schedule' && <ScheduleManager />}
      {view === 'inbox' && <SwapMarket />}
      {view === 'formalize' && (
        <FormalizationCertificate 
          matchId="SW-98234-MART"
          studentA="Roberto A. Martínez"
          studentB="Elena L. García"
          subjectA="Criptografía I"
          subjectB="Sistemas Distribuidos"
          status="APROBADO"
        />
      )}
      {view === 'profile' && <ProfileSettings />}
    </DashboardLayout>
  );
};

export default App;
