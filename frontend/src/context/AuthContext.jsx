import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from local storage
  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          setUser({ ...res.data, token: storedToken });
        } catch (error) {
          console.error("Token invalid or expired", error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, role = 'analyst') => {
    try {
      const res = await axios.post(`${API_URL}/register`, { name, email, password, role });
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
