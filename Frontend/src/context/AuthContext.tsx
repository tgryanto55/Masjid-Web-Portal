import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUserData: (user: User) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('masjid_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('masjid_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('masjid_user');
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, pass);


      localStorage.setItem('token', data.token);

      setUser(data.user);
      return true;
    } catch (err: any) {
      console.error("Login Failed", err);
      const msg = err.response?.data?.message || 'Gagal login. Periksa email dan password.';
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('masjid_user');
    setUser(null);
  };

  const updateUserData = (userData: User) => {
    setUser(prev => prev ? { ...prev, ...userData } : userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserData, isAuthenticated: !!user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};