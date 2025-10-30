import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config/apiconfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.id) checkSubscription();
  }, [user.id]);

  const checkSubscription = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${config.BASE_URL}/user/${user.id}/subscription/isActive`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const subscription = response.data[0];
      setUser((prev) => ({ ...prev, subscriptionActive: subscription?.active || false }));
    } catch (error) {
      console.error('Subscription check error:', error);
      toast.error('Failed to check subscription.');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
    localStorage.setItem('user', JSON.stringify({
      id: userData.userId,
      name: userData.userName,
      email: userData.emailId,
      roles: userData.roleName,
    }));
    setUser({
      id: userData.userId,
      name: userData.userName,
      email: userData.emailId,
      roles: userData.roleName,
      subscriptionActive: false, // Will be updated by checkSubscription
    });
    checkSubscription();
  };

  const logout = () => {
    localStorage.clear();
    setUser({});
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;