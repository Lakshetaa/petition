import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.post('/api/auth/register', userData);
      
    } catch (err) {
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

  const updateProfile = async (userData) => {
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
      
    } catch (err) {
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