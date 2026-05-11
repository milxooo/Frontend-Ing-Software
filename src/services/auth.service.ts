/**
 * Servicio de Autenticación del Frontend.
 * Gestiona login, registro, token JWT y perfil del usuario.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface AuthUser {
  id: string;
  studentId: string;
  email: string;
  fullName: string;
  program: string;
  semester: number;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

const TOKEN_KEY = 'optima_token';
const USER_KEY = 'optima_user';

/**
 * Iniciar sesión
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || result.message || 'Error al iniciar sesión');
  }

  // Manejar tanto { data: { token, user } } como { token, user } directamente
  const loginData = (result.data || result) as LoginResponse;

  // Guardar en localStorage
  localStorage.setItem(TOKEN_KEY, loginData.token);
  localStorage.setItem(USER_KEY, JSON.stringify(loginData.user));

  return loginData;
};

/**
 * Registrar usuario
 */
export const register = async (
  email: string,
  password: string,
  fullName: string,
  studentId: string,
  program: string,
  semester: number
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName, studentId, program, semester }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Error al registrarse');
  }

  const loginData = result.data as LoginResponse;

  localStorage.setItem(TOKEN_KEY, loginData.token);
  localStorage.setItem(USER_KEY, JSON.stringify(loginData.user));

  return loginData;
};

/**
 * Cerrar sesión
 */
export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Obtener token actual
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Obtener usuario actual
 */
export const getCurrentUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

/**
 * Verificar si hay sesión activa
 */
export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getCurrentUser();
};

/**
 * Obtener el perfil actualizado del usuario desde el servidor
 */
export const getProfile = async (): Promise<AuthUser> => {
  const response = await authFetch('/auth/me');
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Sesión inválida');
  }

  const user = result.data as AuthUser;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
};

/**
 * Fetch con autenticación JWT automática.
 * Usar en lugar de fetch() para endpoints protegidos.
 */
export const authFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};
