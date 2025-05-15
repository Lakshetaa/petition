import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: UpdateProfileData) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface RegisterData {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

interface UpdateProfileData {
  username?: string;
  fullName?: string;
  email?: string;
  password?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.post('/api/auth/register', userData);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw new Error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (userData: UpdateProfileData) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) throw new Error('Not authenticated');

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put('/api/users/profile', userData, config);
      
      // Keep the token from the current user
      const updatedUser = { ...data, token: user.token };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw new Error(err.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};