import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('homebite_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('homebite_token'));
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authApi.login(credentials);
      setToken(res.token);
      localStorage.setItem('homebite_token', res.token);
      
      const userData = {
        id: res.id,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
        cookProfileId: res.cookProfileId
      };
      setUser(userData);
      localStorage.setItem('homebite_user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const registerCustomer = async (data) => {
    setLoading(true);
    try {
      const res = await authApi.registerCustomer(data);
      setToken(res.token);
      localStorage.setItem('homebite_token', res.token);
      const userData = {
        id: res.id,
        email: res.email,
        fullName: res.fullName,
        role: res.role,
        cookProfileId: null
      };
      setUser(userData);
      localStorage.setItem('homebite_user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const registerCook = async (data) => {
    setLoading(true);
    try {
      const res = await authApi.registerCook(data);
      setToken(res.token);
      localStorage.setItem('homebite_token', res.token);
      const userData = {
        id: res.id,
        email: res.email,
        fullName: data.fullName,
        role: 'COOK',
        cookProfileId: res.cookProfileId
      };
      setUser(userData);
      localStorage.setItem('homebite_user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('homebite_token');
    localStorage.removeItem('homebite_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!user,
      isCustomer: user?.role === 'CUSTOMER',
      isCook: user?.role === 'COOK',
      isAdmin: user?.role === 'ADMIN',
      login,
      registerCustomer,
      registerCook,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
