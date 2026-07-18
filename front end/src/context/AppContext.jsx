import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize Auth & Cart from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedCart = localStorage.getItem('cart');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    
    setLoading(false);
  }, []);

  // Write Cart to LocalStorage when changed
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const login = async (email, password) => {
    const data = await api.auth.login(email, password);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    return data;
  };

  const register = async (username, email, password) => {
    const data = await api.auth.register(username, email, password);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateProfile = async (profileData) => {
    const updated = await api.auth.updateProfile(profileData);
    // Update local state keeping token
    const newUserState = { ...user, ...updated };
    setUser(newUserState);
    localStorage.setItem('user', JSON.stringify(newUserState));
    return updated;
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    user,
    cart,
    loading,
    login,
    register,
    logout,
    updateProfile,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
export default AppContext;
