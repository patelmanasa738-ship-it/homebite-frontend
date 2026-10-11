import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0,
    totalItems: 0
  });
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const refreshCart = async () => {
    try {
      const data = await cartApi.get();
      setCart(data);
    } catch (e) {
      console.warn('Failed to fetch cart', e);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (dishId, quantity = 1, specialInstructions = '') => {
    setLoading(true);
    try {
      const updated = await cartApi.addItem({ dishId, quantity, specialInstructions });
      setCart(updated);
      setIsDrawerOpen(true);
      return updated;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    try {
      const updated = await cartApi.updateQuantity(itemId, quantity);
      setCart(updated);
      return updated;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      const updated = await cartApi.removeItem(itemId);
      setCart(updated);
      return updated;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      isDrawerOpen,
      setIsDrawerOpen,
      addToCart,
      updateQuantity,
      removeItem,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
