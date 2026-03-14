import { createContext, useContext, useEffect, useState } from 'react';
import { post } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          setToken(parsed.token);
          setUser(parsed.user || null);
        }
      } catch {
        localStorage.removeItem('auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const safeEmail = String(email || '').trim();
    const safePassword = String(password || '');

    if (!safeEmail || !safePassword) {
      throw new Error('Email and password are required.');
    }

    const data = await post('/login', { email: safeEmail, password: safePassword });
    const nextToken = data.token || data.access_token;
    const nextUser = data.user || { email: safeEmail };

    if (!nextToken) {
      throw new Error('Authentication token not returned by API.');
    }

    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem('auth', JSON.stringify({ token: nextToken, user: nextUser }));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth');
    post('/logout', {}).catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

