import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();
const API = '/api';

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (isAuthenticated) fetchWishlist();
    else setWishlist([]);
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(`${API}/wishlist`);
      setWishlist(data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWishlist = async (productId) => {
    const { data } = await axios.post(`${API}/wishlist/${productId}`);
    if (data.added) {
      // we need to refetch to get full product
      fetchWishlist();
    } else {
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    }
    return data.added;
  };

  const isInWishlist = (productId) => wishlist.some((p) => p._id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
