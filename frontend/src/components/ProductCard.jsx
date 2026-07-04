import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './ProductCard.css';

const DEFAULT_FALLBACK_IMAGE = 'https://images.bewakoof.com/t1080/men-s-maroon-venom-graphic-printed-oversized-t-shirt-647166-1700211803-1.jpg';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const wished = isInWishlist(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const added = await toggleWishlist(product._id);
    showToast(added ? '❤️ Added to Wishlist' : 'Removed from Wishlist', added ? 'success' : 'default');
  };

  const discountLabel = product.discountPercent > 0 ? `${product.discountPercent}% OFF` : null;
  const primaryImage = product.images?.[0] || DEFAULT_FALLBACK_IMAGE;
  const hoverImage = product.images?.[1] || primaryImage;

  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_FALLBACK_IMAGE;
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      {/* Image Container */}
      <div className="product-card-img-wrap">
        <img
          src={primaryImage}
          alt={product.name}
          className="product-img product-img-primary"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleImgError}
        />
        <img
          src={hoverImage}
          alt={product.name}
          className="product-img product-img-hover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleImgError}
        />

        {/* Badges */}
        <div className="product-badges">
          {product.fit && <span className="badge badge-fit">{product.fit.toUpperCase()} FIT</span>}
        </div>

        {/* Wishlist Button */}
        <button
          className={`wishlist-btn ${wished ? 'wished' : ''}`}
          onClick={handleWishlist}
          aria-label="Add to Wishlist"
        >
          <svg viewBox="0 0 24 24" fill={wished ? '#e53935' : 'none'} stroke={wished ? '#e53935' : 'currentColor'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {discountLabel && <div className="product-discount-badge">{discountLabel}</div>}
      </div>

      {/* Product Info */}
      <div className="product-card-info">
        {/* Rating */}
        {product.rating > 0 && (
          <div className="product-card-rating">
            <span className="rating">
              {product.rating} ★
            </span>
            {product.ratingCount > 0 && (
              <span className="rating-count">({product.ratingCount.toLocaleString()})</span>
            )}
          </div>
        )}

        <h3 className="product-card-name" title={product.name}>{product.name}</h3>

        <div className="price-block">
          <span className="price-current">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="price-original">₹{product.originalPrice}</span>
          )}
          {product.discountPercent > 0 && (
            <span className="price-discount">({product.discountPercent}% OFF)</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
