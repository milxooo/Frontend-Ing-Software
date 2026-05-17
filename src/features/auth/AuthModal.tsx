import React, { useState, useEffect } from 'react';
import { authService } from '../../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; role: string }) => void;
}

type AuthScreen = 
  | 'login' 
  | 'register'
  | 'forgot' 
  | 'email_sent' 
  | 'reset_password' 
  | 'reset_success' 
  | 'microsoft_sso'
  | 'google_sso';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [screen, setScreen] = useState<AuthScreen>('login');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Register Form States
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerId, setRegisterId] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmRegisterPassword, setConfirmRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [resetToken, setResetToken] = useState('');
  
  // Microsoft SSO Form States
  const [ssoEmail, setSsoEmail] = useState('');
  const [ssoStep, setSsoStep] = useState<1 | 2>(1);
  const [ssoPassword, setSsoPassword] = useState('');
  const [ssoError, setSsoError] = useState('');

  // Google SSO Form States
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleStep, setGoogleStep] = useState<1 | 2>(1);
  const [googlePassword, setGooglePassword] = useState('');
  const [googleError, setGoogleError] = useState('');
  
  // Reset Password States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0); // 0 to 4
  
  // General Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Clean states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setScreen('login');
      setLoginEmail('');
      setLoginPassword('');
      setLoginError('');
      setForgotEmail('');
      setForgotError('');
      setNewPassword('');
      setConfirmPassword('');
      setResetError('');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterId('');
      setRegisterPassword('');
      setConfirmRegisterPassword('');
      setRegisterError('');
      setRegisterSuccess(false);
      setGoogleEmail('');
      setGooglePassword('');
      setGoogleStep(1);
      setGoogleError('');
    } else {
      // Check if we are opening because of a password reset link
      if (window.location.pathname === '/reset-password') {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
          setResetToken(token);
          setScreen('reset_password');
        }
      }
    }
  }, [isOpen]);

  // Dynamic Password Strength Calculation
  useEffect(() => {
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;
    setPasswordStrength(score);
  }, [newPassword]);

  if (!isOpen) return null;

  // Handle User Login (US-17)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Por favor complete todos los campos.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.login(loginEmail, loginPassword);
      setIsLoading(false);

      if (res.success && res.data) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('studentId', res.data.student.id);
        localStorage.setItem('studentName', res.data.student.nombreCompleto);
        localStorage.setItem('studentEmail', res.data.student.emailInstitucional);

        onLoginSuccess({
          name: res.data.student.nombreCompleto,
          email: res.data.student.emailInstitucional,
          role: res.data.student.identificacionUniversidad?.startsWith('GGL-') ? 'Usuario General (Google)' : 'Estudiante Ingeniería',
        });
        onClose();
      } else {
        setLoginError('Credenciales incorrectas o usuario no registrado.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setLoginError(err.message || 'Error al conectar con el servidor.');
    }
  };

  // Handle Registration Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!registerName || !registerEmail || !registerId || !registerPassword || !confirmRegisterPassword) {
      setRegisterError('Por favor, complete todos los campos obligatorios.');
      return;
    }

    if (registerPassword !== confirmRegisterPassword) {
      setRegisterError('Las contraseñas no coinciden.');
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.register({
        identificacionUniversidad: registerId,
        nombreCompleto: registerName,
        emailInstitucional: registerEmail,
        password: registerPassword
      });
      setIsLoading(false);

      if (res.success) {
        setRegisterSuccess(true);
        setLoginEmail(registerEmail); // Pre-fill email for login
        setTimeout(() => {
          setScreen('login');
          setRegisterSuccess(false);
        }, 1500);
      } else {
        setRegisterError(res.message || 'Error durante el registro.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setRegisterError(err.message || 'Error de conexión.');
    }
  };

  // Handle Request Password Reset (US-18)
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotEmail) {
      setForgotError('Por favor introduce tu correo electrónico.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotError('Introduce un correo electrónico válido.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.forgotPassword(forgotEmail);
      setIsLoading(false);
      
      if (res.success && res.data) {
        setResetToken(res.data.token);
        setScreen('email_sent');
      } else {
        setForgotError('No se pudo enviar el enlace de recuperación.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setForgotError(err.message || 'Error al conectar con el servidor.');
    }
  };

  // Handle Password Reset Update (US-18 Link click action)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (newPassword.length < 6) {
      setResetError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.resetPassword(resetToken, newPassword);
      setIsLoading(false);

      if (res.success) {
        setScreen('reset_success');
        setLoginEmail(forgotEmail); // Pre-fill email for login
      } else {
        setResetError('Error al restablecer la contraseña.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setResetError(err.message || 'Error al conectar con el servidor.');
    }
  };

  // Microsoft SSO Handlers
  const startMicrosoftSSOFlow = () => {
    const clientId = 'd8558850-7a03-47da-82b3-4a91a847fb48';
    const redirectUri = window.location.origin + '/';
    const scope = encodeURIComponent('openid profile email');
    const nonce = 'optimaNoncestudent123';
    
    const microsoftLoginUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=id_token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_mode=fragment&nonce=${nonce}`;
    window.location.href = microsoftLoginUrl;
  };

  const startMicrosoftSSOSimulation = () => {
    setSsoEmail('');
    setSsoPassword('');
    setSsoStep(1);
    setSsoError('');
    setScreen('microsoft_sso');
  };

  const handleSSOSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSsoError('');

    if (ssoStep === 1) {
      if (!ssoEmail) {
        setSsoError('Escriba una dirección de correo electrónico, un número de teléfono o un nombre de Skype válidos.');
        return;
      }
      if (!ssoEmail.includes('@') || !ssoEmail.endsWith('.edu.co')) {
        setSsoError('Escriba una dirección de correo electrónico institucional válida (.edu.co).');
        return;
      }
      setSsoStep(2);
    } else {
      if (!ssoPassword) {
        setSsoError('Escriba la contraseña de su cuenta profesional o educativa.');
        return;
      }

      setIsLoading(true);

      try {
        const nameFromEmail = ssoEmail.split('@')[0]
          .split(/[._-]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');

        const res = await authService.ssoCallback(ssoEmail, nameFromEmail);
        setIsLoading(false);

        if (res.success && res.data) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('studentId', res.data.student.id);
          localStorage.setItem('studentName', res.data.student.nombreCompleto);
          localStorage.setItem('studentEmail', res.data.student.emailInstitucional);

          onLoginSuccess({
            name: res.data.student.nombreCompleto,
            email: res.data.student.emailInstitucional,
            role: 'Estudiante Ingeniería',
          });
          onClose();
        } else {
          setSsoError('Error en la federación de identidades de Microsoft.');
        }
      } catch (err: any) {
        setIsLoading(false);
        setSsoError(err.message || 'Error al conectar con el servidor de autenticación.');
      }
    }
  };

  const startGoogleSSOFlow = () => {
    const clientId = '379885088940-7kte7j5miensi8ai1bmvft72r7iso6cl.apps.googleusercontent.com';
    const redirectUri = window.location.origin + '/';
    const scope = encodeURIComponent('openid profile email');
    
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    window.location.href = googleLoginUrl;
  };

  const startGoogleSSOSimulation = () => {
    setGoogleEmail('');
    setGooglePassword('');
    setGoogleStep(1);
    setGoogleError('');
    setScreen('google_sso');
  };

  const handleGoogleSSOSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleError('');

    if (googleStep === 1) {
      if (!googleEmail) {
        setGoogleError('Introduce un correo electrónico o un número de teléfono.');
        return;
      }
      if (!googleEmail.includes('@')) {
        setGoogleError('Introduce una dirección de correo electrónico válida.');
        return;
      }
      setGoogleStep(2);
    } else {
      if (!googlePassword) {
        setGoogleError('Introduce la contraseña de tu cuenta Google.');
        return;
      }

      setIsLoading(true);

      try {
        const nameFromEmail = googleEmail.split('@')[0]
          .split(/[._-]/)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');

        const res = await authService.googleCallback(googleEmail, nameFromEmail);
        setIsLoading(false);

        if (res.success && res.data) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('studentId', res.data.student.id);
          localStorage.setItem('studentName', res.data.student.nombreCompleto);
          localStorage.setItem('studentEmail', res.data.student.emailInstitucional);

          onLoginSuccess({
            name: res.data.student.nombreCompleto,
            email: res.data.student.emailInstitucional,
            role: 'Usuario General (Google)',
          });
          onClose();
        } else {
          setGoogleError('Error al iniciar sesión con Google.');
        }
      } catch (err: any) {
        setIsLoading(false);
        setGoogleError(err.message || 'Error de conexión con el servidor.');
      }
    }
  };

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { text: 'Débil', color: 'text-error bg-error/10 border-error/20', bar: 'bg-error w-1/4' };
      case 2:
        return { text: 'Media', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', bar: 'bg-amber-400 w-2/4' };
      case 3:
        return { text: 'Fuerte', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', bar: 'bg-indigo-400 w-3/4' };
      case 4:
        return { text: 'Excelente', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', bar: 'bg-emerald-400 w-full' };
      default:
        return { text: 'Débil', color: 'text-error bg-error/10 border-error/20', bar: 'bg-error w-1/4' };
    }
  };

  const strength = getStrengthLabel();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => screen !== 'email_sent' && screen !== 'reset_password' && onClose()}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Main Glass Modal */}
      <div className="relative w-full max-w-lg glass-card overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.2)] animate-fade-in z-10 flex flex-col max-h-[90vh]">
        {/* Decorative Top Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-indigo-500 to-tertiary"></div>

        {/* Modal Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center relative z-20">
          <div className="flex items-center gap-2">
            <span className="text-primary material-symbols-outlined text-3xl font-black">auto_awesome</span>
            <span className="text-xl font-bold font-display text-white">OptimaAcademia</span>
          </div>
          {screen !== 'email_sent' && screen !== 'reset_password' && (
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Container */}
        <div className="px-8 pb-8 overflow-y-auto custom-scrollbar flex-grow">
          
          {/* SCREEN 1: LOGIN */}
          {screen === 'login' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl font-bold text-white font-display mb-1">Iniciar Sesión</h3>
                <p className="text-slate-400 text-sm">Gestiona tus horarios universitarios e intercambios.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Correo Electrónico</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">mail</span>
                    <input 
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-100 transition-all placeholder:text-slate-650"
                      placeholder="ejemplo@optima.edu.co o gmail.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Contraseña</label>
                    <button 
                      type="button"
                      onClick={() => setScreen('forgot')}
                      className="text-xs font-bold text-primary hover:text-indigo-400 transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">lock</span>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-100 transition-all placeholder:text-slate-650"
                      placeholder="••••••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {loginError && (
                  <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-xs flex items-start gap-3 animate-shake">
                    <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
                    <div>
                      <p className="font-bold">Error de Acceso</p>
                      <p className="mt-0.5 text-error/80 leading-relaxed">{loginError}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group overflow-hidden bg-primary-container text-on-primary-container font-black py-4 rounded-2xl shadow-xl shadow-primary-container/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <span className="material-symbols-outlined animate-spin text-xl">sync</span>
                    ) : (
                      <>
                        <span>Ingresar al Sistema</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </form>

              {/* DUAL SSO SECTIONS */}
              <div className="pt-2 space-y-4">
                
                {/* 1. Student Access Section (Microsoft) */}
                <div className="border border-white/5 rounded-2xl p-4 bg-white/5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-200 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    ¿Eres Estudiante?
                  </div>
                  <p className="text-[11px] text-slate-400">Inicia sesión al instante usando las credenciales oficiales de tu universidad:</p>
                  
                  <button
                    type="button"
                    onClick={startMicrosoftSSOFlow}
                    className="w-full bg-[#24292e] hover:bg-[#2f363d] border border-white/10 text-white font-medium py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" 
                      alt="Microsoft Logo" 
                      className="w-4 h-4 shrink-0"
                    />
                    <span className="text-xs font-semibold text-slate-200">Ingresar con Microsoft Universitario</span>
                  </button>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={startMicrosoftSSOSimulation}
                      className="text-[9px] text-slate-500 hover:text-slate-400 underline cursor-pointer"
                    >
                      Demostrar pasarela Microsoft simulada
                    </button>
                  </div>
                </div>

                {/* 2. General Access Section (Google) */}
                <div className="border border-white/5 rounded-2xl p-4 bg-white/5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-200 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea4335]"></span>
                    ¿No eres Estudiante?
                  </div>
                  <p className="text-[11px] text-slate-400">Accede como invitado, profesor o coordinador con tu cuenta de correo personal:</p>
                  
                  <button
                    type="button"
                    onClick={startGoogleSSOFlow}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 font-medium py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                      alt="Google Logo" 
                      className="w-4 h-4 shrink-0"
                    />
                    <span className="text-xs font-semibold text-slate-750">Ingresar con Google Personal</span>
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={startGoogleSSOSimulation}
                      className="text-[9px] text-slate-500 hover:text-slate-400 underline cursor-pointer"
                    >
                      Demostrar pasarela Google simulada
                    </button>
                  </div>
                </div>

              </div>

              {/* Bottom switch to Register */}
              <div className="text-center pt-2 border-t border-white/5">
                <span className="text-xs text-slate-400">¿No tienes una cuenta aún? </span>
                <button
                  type="button"
                  onClick={() => setScreen('register')}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Regístrate Gratis
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: REGISTER */}
          {screen === 'register' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-2xl font-bold text-white font-display mb-1">Crear Cuenta</h3>
                <p className="text-slate-400 text-sm">Regístrate para optimizar tu carga académica.</p>
              </div>

              {registerSuccess ? (
                <div className="p-8 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl animate-fade-in">
                  <span className="material-symbols-outlined text-emerald-400 text-5xl">check_circle</span>
                  <h4 className="text-lg font-bold text-white">¡Registro Exitoso!</h4>
                  <p className="text-xs text-slate-450">Tu cuenta ha sido creada. Redirigiendo al inicio de sesión...</p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Nombre Completo</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">person</span>
                      <input 
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-100 transition-all placeholder:text-slate-650"
                        placeholder="Juan Rivera"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Correo Electrónico</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">mail</span>
                      <input 
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-100 transition-all placeholder:text-slate-650"
                        placeholder="ejemplo@optima.edu.co o gmail.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Student ID / Identification Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Identificación o ID de Estudiante</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">badge</span>
                      <input 
                        type="text"
                        value={registerId}
                        onChange={(e) => setRegisterId(e.target.value)}
                        className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-100 transition-all placeholder:text-slate-650"
                        placeholder="U123456"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Contraseña</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">lock</span>
                      <input 
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-100 transition-all placeholder:text-slate-650"
                        placeholder="Mínimo 6 caracteres"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Confirmar Contraseña</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">lock_open</span>
                      <input 
                        type="password"
                        value={confirmRegisterPassword}
                        onChange={(e) => setConfirmRegisterPassword(e.target.value)}
                        className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-100 transition-all placeholder:text-slate-650"
                        placeholder="Repite la contraseña"
                        required
                      />
                    </div>
                  </div>

                  {/* Error Box */}
                  {registerError && (
                    <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-error text-xs flex items-center gap-2 animate-shake">
                      <span className="material-symbols-outlined text-base">error</span>
                      <span>{registerError}</span>
                    </div>
                  )}

                  {/* Register Submit Button */}
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative group overflow-hidden bg-primary-container text-on-primary-container font-black py-3.5 rounded-2xl shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                      ) : (
                        <>
                          <span>Registrar Cuenta</span>
                          <span className="material-symbols-outlined text-lg">assignment_ind</span>
                        </>
                      )}
                    </div>
                  </button>
                </form>
              )}

              {/* SSO Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-white/10 w-full"></div>
                <span className="absolute px-3 bg-[#0a0f1d] text-slate-500 text-[10px] uppercase tracking-wider font-bold">O también regístrate con</span>
              </div>

              {/* Google signup button inside Register screen */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={startGoogleSSOFlow}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 font-semibold py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                    alt="Google Logo" 
                    className="w-4 h-4 shrink-0"
                  />
                  <span className="text-xs font-semibold text-slate-750">Registrarse con Google</span>
                </button>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={startGoogleSSOSimulation}
                    className="text-[9px] text-slate-500 hover:text-slate-400 underline cursor-pointer"
                  >
                    Usar pasarela Google simulada
                  </button>
                </div>
              </div>

              {/* Back to login */}
              <div className="text-center pt-2 border-t border-white/5">
                <span className="text-xs text-slate-400">¿Ya tienes una cuenta? </span>
                <button
                  type="button"
                  onClick={() => setScreen('login')}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                  Inicia Sesión
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3: FORGOT PASSWORD */}
          {screen === 'forgot' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-3xl font-bold text-white font-display mb-1">Recuperar Acceso</h3>
                <p className="text-slate-400 text-sm">Ingresa tu correo registrado y te enviaremos un enlace seguro para restablecer tu contraseña.</p>
              </div>

              <form onSubmit={handleRequestReset} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Correo Electrónico</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">mail</span>
                    <input 
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-100 transition-all placeholder:text-slate-600"
                      placeholder="ejemplo@optima.edu.co"
                    />
                  </div>
                </div>

                {forgotError && (
                  <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-xs flex items-center gap-2 animate-shake">
                    <span className="material-symbols-outlined text-base">error</span>
                    <span>{forgotError}</span>
                  </div>
                )}

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setScreen('login')}
                    className="w-1/3 border border-white/10 text-white font-bold py-4 rounded-2xl hover:bg-white/5 transition-all text-sm cursor-pointer"
                  >
                    Volver
                  </button>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="flex-grow relative group overflow-hidden bg-primary-container text-on-primary-container font-black py-4 rounded-2xl shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <span className="material-symbols-outlined animate-spin text-xl">sync</span>
                      ) : (
                        <>
                          <span>Enviar Enlace</span>
                          <span className="material-symbols-outlined text-lg">send</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SCREEN 4: EMAIL SENT SUCCESS / MOCK INBOX */}
          {screen === 'email_sent' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                  <span className="material-symbols-outlined text-3xl">mark_email_read</span>
                </div>
                <h3 className="text-2xl font-bold text-white font-display">¡Enlace Enviado!</h3>
                <p className="text-slate-400 text-xs px-4">
                  Hemos enviado un token seguro a <span className="text-slate-200 font-bold">{forgotEmail}</span>. No se requiere intervención administrativa.
                </p>
              </div>

              {/* MOCK EMAIL CLIENT BLOCK - EXTREMELY PREMIUM FEATURE */}
              <div className="border border-white/10 rounded-3xl overflow-hidden bg-slate-950/70 shadow-2xl">
                <div className="bg-slate-900 px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-error"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider font-bold uppercase">Bandeja de Entrada (Simulación local)</span>
                  <div className="w-6"></div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="text-xs space-y-1.5 border-b border-white/5 pb-3">
                    <p className="text-slate-500"><span className="font-bold text-slate-400">De:</span> soporte@optima.edu.co</p>
                    <p className="text-slate-500"><span className="font-bold text-slate-400">Para:</span> {forgotEmail}</p>
                    <p className="text-slate-200 font-bold"><span className="text-slate-500 font-normal">Asunto:</span> [OptimaAcademia] Restablecer Contraseña (US-18)</p>
                  </div>

                  <div className="space-y-4 pt-1">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Hola,<br/><br/>
                      Recibimos una solicitud para restablecer la contraseña de tu cuenta en <span className="font-bold text-white">OptimaAcademia</span>. Puedes restaurar tus credenciales de forma autónoma haciendo clic en el siguiente enlace:
                    </p>

                    <div className="py-2">
                      <button
                        onClick={() => setScreen('reset_password')}
                        className="w-full bg-gradient-to-r from-primary to-indigo-500 text-slate-950 font-black text-center py-3.5 rounded-2xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all text-xs cursor-pointer"
                      >
                        Restablecer Contraseña Autónoma
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-normal">
                      Este enlace es de un solo uso y expirará en 15 minutos. Si no has solicitado esto, puedes ignorar este correo de forma segura.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setScreen('login')}
                  className="w-full bg-white/5 border border-white/10 text-slate-300 hover:text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all text-sm cursor-pointer"
                >
                  Volver al Login
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 5: RESET PASSWORD FORM */}
          {screen === 'reset_password' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-3xl font-bold text-white font-display mb-1">Nueva Contraseña</h3>
                <p className="text-slate-400 text-sm">Establece tu nueva credencial de seguridad. Utiliza una clave robusta.</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Nueva Contraseña</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">lock_reset</span>
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-100 transition-all placeholder:text-slate-600"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">Confirmar Contraseña</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">lock_open</span>
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-100 transition-all placeholder:text-slate-600"
                      placeholder="Repite la contraseña"
                    />
                  </div>
                </div>

                {/* Strength Meter */}
                {newPassword.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Fuerza de la clave:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${strength.color}`}>
                        {strength.text}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 rounded-full ${strength.bar}`}></div>
                    </div>
                  </div>
                )}

                {resetError && (
                  <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-xs flex items-center gap-2 animate-shake">
                    <span className="material-symbols-outlined text-base">error</span>
                    <span>{resetError}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading || newPassword.length < 6 || newPassword !== confirmPassword}
                  className="w-full relative group overflow-hidden bg-primary-container text-on-primary-container font-black py-4 rounded-2xl shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <span className="material-symbols-outlined animate-spin text-xl">sync</span>
                    ) : (
                      <>
                        <span>Actualizar Contraseña Autónoma</span>
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          )}

          {/* SCREEN 6: RESET SUCCESS */}
          {screen === 'reset_success' && (
            <div className="space-y-6 animate-fade-in py-4 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-bounce">
                <span className="material-symbols-outlined text-5xl">task_alt</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-white font-display">Contraseña Actualizada</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                  Tu contraseña ha sido restablecida con éxito mediante el flujo autónomo de seguridad. Ya puedes ingresar al sistema.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setScreen('login')}
                  className="w-full relative group overflow-hidden bg-primary-container text-on-primary-container font-black py-4.5 rounded-2xl shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <span>Iniciar Sesión Ahora</span>
                    <span className="material-symbols-outlined text-lg">login</span>
                  </div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 7: SIMULATED MICROSOFT ENTRA ID SSO LOGIN SCREEN */}
          {screen === 'microsoft_sso' && (
            <div className="bg-white text-slate-700 p-8 rounded-xl shadow-2xl space-y-6 animate-fade-in relative text-left">
              {/* Microsoft Close Button (Returns to App) */}
              <button 
                type="button"
                onClick={() => setScreen('login')}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="space-y-4">
                {/* Microsoft Color Grid Logo */}
                <div className="grid grid-cols-2 gap-0.5 w-6 h-6 shrink-0">
                  <div className="bg-[#f25022] w-2.5 h-2.5"></div>
                  <div className="bg-[#7fba00] w-2.5 h-2.5"></div>
                  <div className="bg-[#00a4ef] w-2.5 h-2.5"></div>
                  <div className="bg-[#ffb900] w-2.5 h-2.5"></div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-800 font-display">
                    {ssoStep === 1 ? 'Iniciar sesión' : 'Escribir contraseña'}
                  </h3>
                  {ssoStep === 2 && (
                    <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      <button 
                        type="button" 
                        onClick={() => setSsoStep(1)}
                        className="hover:underline text-left cursor-pointer"
                      >
                        {ssoEmail}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSSOSubmit} className="space-y-4">
                {ssoStep === 1 ? (
                  <div className="space-y-3">
                    <input 
                      type="email"
                      value={ssoEmail}
                      onChange={(e) => setSsoEmail(e.target.value)}
                      placeholder="Correo electrónico, teléfono o Skype"
                      className="w-full bg-transparent border-b border-slate-400 focus:border-[#0067b8] py-2 focus:outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400"
                    />
                    <div className="text-[11px] text-slate-600 leading-relaxed">
                      ¿No tiene una cuenta? <span className="text-[#0067b8] hover:underline cursor-pointer">Cree una.</span><br/>
                      ¿No puede acceder a su cuenta? <span className="text-[#0067b8] hover:underline cursor-pointer">¿Tiene problemas para iniciar sesión?</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input 
                      type="password"
                      value={ssoPassword}
                      onChange={(e) => setSsoPassword(e.target.value)}
                      placeholder="Contraseña"
                      className="w-full bg-transparent border-b border-slate-400 focus:border-[#0067b8] py-2 focus:outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400"
                      autoFocus
                    />
                    <div className="text-[11px] text-[#0067b8] hover:underline cursor-pointer">
                      ¿Olvidó su contraseña?
                    </div>
                  </div>
                )}

                {ssoError && (
                  <div className="text-red-600 text-xs py-1 leading-relaxed animate-shake">
                    {ssoError}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setScreen('login')}
                    className="bg-[#cccccc] hover:bg-[#bbbbbb] text-slate-800 font-semibold px-4 py-2 text-xs shadow-md transition-all cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#0067b8] hover:bg-[#005da6] text-white font-semibold px-6 py-2 text-xs shadow-md active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? 'Iniciando...' : ssoStep === 1 ? 'Siguiente' : 'Iniciar sesión'}
                  </button>
                </div>
              </form>

              {/* Microsoft Footer */}
              <div className="border-t border-slate-200 pt-4 flex justify-between text-[10px] text-slate-500 font-medium">
                <span>Microsoft Entra ID (Federado)</span>
                <span className="hover:underline cursor-pointer">Condiciones de uso</span>
              </div>
            </div>
          )}

          {/* SCREEN 8: SIMULATED GOOGLE IDENTITY PLATFORM SSO LOGIN SCREEN */}
          {screen === 'google_sso' && (
            <div className="bg-white text-slate-700 p-8 rounded-2xl shadow-2xl space-y-6 animate-fade-in relative text-left border border-slate-200">
              {/* Google Close Button (Returns to App) */}
              <button 
                type="button"
                onClick={() => setScreen('login')}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="text-center space-y-4">
                {/* Google Multi-colored G Logo */}
                <div className="flex justify-center">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
                    alt="Google Logo" 
                    className="h-7 shrink-0"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-normal text-slate-900 font-sans">
                    {googleStep === 1 ? 'Iniciar sesión' : 'Te damos la bienvenida'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {googleStep === 1 ? 'Ir a OptimaAcademia' : googleEmail}
                  </p>
                </div>
              </div>

              <form onSubmit={handleGoogleSSOSubmit} className="space-y-5 pt-2">
                {googleStep === 1 ? (
                  <div className="space-y-4">
                    <div className="relative border border-slate-350 rounded-md focus-within:border-[#1a73e8] focus-within:ring-1 focus-within:ring-[#1a73e8] transition-all px-3 py-2">
                      <label className="block text-[10px] text-slate-550 font-medium focus-within:text-[#1a73e8]">Correo electrónico o teléfono</label>
                      <input 
                        type="email"
                        value={googleEmail}
                        onChange={(e) => setGoogleEmail(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none text-sm text-slate-900 placeholder:text-slate-400 py-0.5"
                        placeholder="nombre@gmail.com"
                        autoFocus
                      />
                    </div>
                    <div className="text-xs text-slate-600 leading-normal">
                      ¿Has olvidado tu correo electrónico?<br/><br/>
                      ¿No es tu ordenador? Usa el modo Invitado para iniciar sesión de forma privada. <span className="text-[#1a73e8] font-semibold hover:underline cursor-pointer">Más información</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative border border-slate-350 rounded-md focus-within:border-[#1a73e8] focus-within:ring-1 focus-within:ring-[#1a73e8] transition-all px-3 py-2">
                      <label className="block text-[10px] text-slate-550 font-medium focus-within:text-[#1a73e8]">Introduce tu contraseña</label>
                      <input 
                        type="password"
                        value={googlePassword}
                        onChange={(e) => setGooglePassword(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none text-sm text-slate-900 placeholder:text-slate-400 py-0.5"
                        placeholder="Contraseña de Google"
                        autoFocus
                      />
                    </div>
                    <div className="text-xs text-[#1a73e8] font-semibold hover:underline cursor-pointer">
                      ¿Has olvidado tu contraseña?
                    </div>
                  </div>
                )}

                {googleError && (
                  <div className="text-[#d93025] text-xs py-1 leading-relaxed animate-shake flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">error</span>
                    <span>{googleError}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setScreen('register')}
                    className="text-[#1a73e8] font-bold text-xs hover:bg-[#1a73e8]/5 px-3 py-2 rounded-md transition-all cursor-pointer"
                  >
                    Crear cuenta
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold px-6 py-2.5 text-xs rounded-md shadow active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? 'Conectando...' : 'Siguiente'}
                  </button>
                </div>
              </form>

              {/* Google Footer */}
              <div className="pt-4 flex justify-between text-[10px] text-slate-500 font-medium border-t border-slate-100">
                <span className="hover:underline cursor-pointer">Español (España)</span>
                <div className="flex gap-3">
                  <span className="hover:underline cursor-pointer">Ayuda</span>
                  <span className="hover:underline cursor-pointer">Privacidad</span>
                  <span className="hover:underline cursor-pointer">Condiciones</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
