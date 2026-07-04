import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) return (
    <div className="wishlist-page container">
      <div className="wishlist-empty">
        <div className="wishlist-empty-icon">💔</div>
        <h2>Your Wishlist is Empty</h2>
        <p>Save items you love to your wishlist!</p>
        <Link to="/" className="btn btn-primary">Discover Products</Link>
      </div>
    </div>
  );

  return (
    <div className="wishlist-page container">
      <h1 className="wishlist-title">My Wishlist ({wishlist.length})</h1>
      <div className="product-grid">
        {wishlist.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
};

export default WishlistPage;
