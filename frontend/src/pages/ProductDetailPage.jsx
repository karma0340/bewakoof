import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './ProductDetailPage.css';

const API = import.meta.env.VITE_API_URL || '/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API}/products/${id}`);
        setProduct(data);
      } catch (err) {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!selectedSize) { setSizeError(true); return; }
    setAddingToCart(true);
    try {
      await addToCart(product._id, selectedSize, 1);
      showToast('✅ Added to Cart!', 'success');
    } catch (err) {
      showToast('Failed to add to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!selectedSize) { setSizeError(true); return; }
    await handleAddToCart();
    navigate('/cart');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const added = await toggleWishlist(product._id);
    showToast(added ? '❤️ Added to Wishlist' : 'Removed from Wishlist', added ? 'success' : 'default');
  };

  if (loading) return (
    <div className="pdp-skeleton container">
      <div className="skeleton" style={{ height: 500, borderRadius: 8 }} />
    </div>
  );
  if (!product) return null;

  const wished = isInWishlist(product._id);
  const inStockSizes = product.sizes?.filter((s) => s.stock > 0) || [];

  return (
    <div className="pdp-wrapper container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span className="breadcrumb-sep">›</span>
        <a href={`/${product.gender}-clothing`}>{product.gender === 'men' ? 'Men' : product.gender === 'women' ? 'Women' : 'Accessories'}</a>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="pdp-layout">
        {/* Left — Images */}
        <div className="pdp-images">
          <div className="pdp-thumbnails">
            {product.images?.map((img, i) => (
              <button
                key={i}
                className={`pdp-thumb ${activeImg === i ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={img} alt={`${product.name} view ${i + 1}`} />
              </button>
            ))}
          </div>
          <div className="pdp-main-img">
            <img
              src={product.images?.[activeImg] || 'https://via.placeholder.com/500x600'}
              alt={product.name}
            />
            {product.fit && <div className="pdp-fit-badge">{product.fit.toUpperCase()} FIT</div>}
          </div>
        </div>

        {/* Right — Info */}
        <div className="pdp-info">
          {product.collaboration && (
            <div className="pdp-collab">{product.collaboration} × Bewakoof</div>
          )}
          <h1 className="pdp-name">{product.name}</h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="pdp-rating-row">
              <span className="rating">
                {product.rating}
                <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </span>
              <span className="pdp-rating-count">{product.ratingCount?.toLocaleString()} Ratings</span>
            </div>
          )}

          {/* Price */}
          <div className="pdp-price-block">
            <span className="pdp-price">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="pdp-original-price">₹{product.originalPrice}</span>
            )}
            {product.discountPercent > 0 && (
              <span className="pdp-discount">{product.discountPercent}% OFF</span>
            )}
          </div>
          <p className="pdp-tax-note">inclusive of all taxes</p>

          {/* Offers */}
          <div className="pdp-offers">
            <div className="pdp-offer-card">
              <span className="offer-icon">🏷️</span>
              <div>
                <strong>Buy Any 3 & Get Extra 15% OFF</strong>
                <span>Use code: BEWAKOOF15</span>
              </div>
            </div>
            <div className="pdp-offer-card">
              <span className="offer-icon">🚚</span>
              <div>
                <strong>Free Delivery on orders above ₹399</strong>
              </div>
            </div>
          </div>

          {/* Size Selector */}
          <div className={`pdp-size-section ${sizeError ? 'error' : ''}`}>
            <div className="pdp-size-header">
              <span className="pdp-size-label">Select Size</span>
              <button className="pdp-size-guide">Size Guide</button>
            </div>
            {sizeError && <p className="pdp-size-error">Please select a size</p>}
            <div className="pdp-size-grid">
              {inStockSizes.map(({ size }) => (
                <button
                  key={size}
                  className={`pdp-size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                >
                  {size}
                </button>
              ))}
              {product.sizes?.filter((s) => s.stock === 0).map(({ size }) => (
                <button key={size} className="pdp-size-btn out-of-stock" disabled>{size}</button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pdp-ctas">
            <button
              className="btn btn-outline pdp-wishlist-btn"
              onClick={handleWishlist}
            >
              <svg viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wished ? 'Wishlisted' : 'Wishlist'}
            </button>
            <button className="btn btn-primary btn-full" onClick={handleAddToCart} disabled={addingToCart}>
              {addingToCart ? 'Adding...' : 'Add to Bag'}
            </button>
          </div>
          <button className="btn btn-yellow btn-full pdp-buy-now" onClick={handleBuyNow}>
            Buy Now
          </button>

          {/* Description */}
          {product.description && (
            <div className="pdp-description">
              <h3>Product Details</h3>
              <p>{product.description}</p>
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="pdp-tags">
              {product.tags.map((tag) => (
                <span key={tag} className="pdp-tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
