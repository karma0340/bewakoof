import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const API = '/api';

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchCart();
    else setCart([]);
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const { data } = await axios.get(`${API}/cart`);
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId, size, quantity = 1) => {
    const { data } = await axios.post(`${API}/cart`, { productId, size, quantity });
    setCart(data);
    return data;
  };

  const updateCartItem = async (itemId, quantity) => {
    const { data } = await axios.put(`${API}/cart/${itemId}`, { quantity });
    setCart(data);
  };

  const removeFromCart = async (itemId) => {
    const { data } = await axios.delete(`${API}/cart/${itemId}`);
    setCart(data);
  };

  const clearCart = async () => {
    await axios.delete(`${API}/cart/clear`);
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, cartLoading, cartCount, cartTotal, addToCart, updateCartItem, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
