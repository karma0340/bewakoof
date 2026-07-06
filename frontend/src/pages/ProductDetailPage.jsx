import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './ProductDetailPage.css';


const baseUrl = import.meta.env.VITE_API_URL || '';
const API = baseUrl ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/api`) : '/api';

const StarRating = ({ rating, onRate, interactive = false }) => (
  <div className="star-row" style={{ display: 'flex', gap: 4 }}>
    {[1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        onClick={interactive ? () => onRate(star) : undefined}
        style={{ cursor: interactive ? 'pointer' : 'default', fontSize: interactive ? 28 : 16, color: star <= rating ? '#FFB900' : '#DDD', transition: 'color 0.15s' }}
      >★</span>
    ))}
  </div>
);

const SizeGuideModal = ({ onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="size-guide-modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Size Guide</h3>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
      <table className="size-table">
        <thead><tr><th>Size</th><th>Chest (in)</th><th>Length (in)</th><th>Shoulder (in)</th></tr></thead>
        <tbody>
          {[['XS', '34-36', '26', '15'], ['S', '36-38', '27', '16'], ['M', '38-40', '28', '17'], ['L', '40-42', '29', '18'], ['XL', '42-44', '30', '19'], ['XXL', '44-46', '31', '20'], ['3XL', '46-48', '32', '21']].map(([s, c, l, sh]) => (
            <tr key={s}><td>{s}</td><td>{c}</td><td>{l}</td><td>{sh}</td></tr>
          ))}
        </tbody>
      </table>
      <p className="size-guide-note">* Measurements in inches. Our sizes run true to fit.</p>
    </div>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewBreakdown, setReviewBreakdown] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotal, setReviewTotal] = useState(0);

  // Pincode state
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    axios.get(`${API}/products/${id}`)
      .then(({ data }) => { setProduct(data); })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    // Load reviews
    axios.get(`${API}/products/${id}/reviews?limit=5&page=${reviewPage}`)
      .then(({ data }) => {
        setReviews(prev => reviewPage === 1 ? data.reviews : [...prev, ...data.reviews]);
        setReviewBreakdown(data.breakdown || {});
        setReviewTotal(data.total || 0);
      }).catch(() => {});
    // Load similar products
    axios.get(`${API}/products/${id}/similar`)
      .then(({ data }) => setSimilarProducts(data.slice(0, 8)))
      .catch(() => {});
  }, [id, reviewPage]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!selectedSize) { setSizeError(true); return; }
    setAddingToCart(true);
    try {
      await addToCart(product._id, selectedSize, 1);
      showToast('✅ Added to Bag!', 'success');
    } catch { showToast('Failed to add to cart', 'error'); }
    finally { setAddingToCart(false); }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!selectedSize) { setSizeError(true); return; }
    await handleAddToCart();
    navigate('/checkout');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const added = await toggleWishlist(product._id);
    showToast(added ? '❤️ Added to Wishlist' : 'Removed from Wishlist', added ? 'success' : 'default');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const { data } = await axios.post(`${API}/products/${id}/reviews`, {
        rating: reviewRating, title: reviewTitle, comment: reviewComment,
      });
      setReviews(prev => [data, ...prev]);
      setReviewTotal(t => t + 1);
      setShowReviewForm(false);
      setReviewTitle(''); setReviewComment(''); setReviewRating(5);
      showToast('✅ Review submitted!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally { setSubmittingReview(false); }
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryStatus({ error: 'Please enter a valid 6-digit Pincode' });
      return;
    }
    setCheckingPincode(true);
    setDeliveryStatus(null);
    setTimeout(() => {
      setCheckingPincode(false);
      const digit = Number(pincode.charAt(0));
      const days = (digit % 3) + 2; // 2 to 4 days delivery
      const d = new Date();
      d.setDate(d.getDate() + days);
      const est = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
      setDeliveryStatus({
        date: est,
        cod: digit % 2 !== 0, // Cash on delivery for odd starting digits
        freeShip: product.price >= 399
      });
    }, 800);
  };


  if (loading) return <Loader fullPage={true} />;
  if (!product) return null;

  const wished = isInWishlist(product._id);
  const inStockSizes = product.sizes?.filter(s => s.stock > 0) || [];
  const outOfStockSizes = product.sizes?.filter(s => s.stock === 0) || [];
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating;
  const totalBreakdownCount = Object.values(reviewBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="pdp-wrapper container">
      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <Link to={`/${product.gender}-clothing`}>{product.gender === 'men' ? 'Men' : product.gender === 'women' ? 'Women' : 'Accessories'}</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{product.category}</span>
      </div>

      <div className="pdp-layout">
        {/* Left — Images */}
        <div className="pdp-images">
          <div className="pdp-thumbnails">
            {product.images?.map((img, i) => (
              <button key={i} className={`pdp-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                <img src={img} alt={`view ${i + 1}`} />
              </button>
            ))}
          </div>
          <div className="pdp-main-img">
            <img src={product.images?.[activeImg] || 'https://via.placeholder.com/500x600'} alt={product.name} />
            {product.fit && <div className="pdp-fit-badge">{product.fit.toUpperCase()} FIT</div>}
          </div>
        </div>

        {/* Right — Info */}
        <div className="pdp-info-col">
          {product.collaboration && <div className="pdp-collab">{product.collaboration} × Bewakoof®</div>}
          <h1 className="pdp-name">{product.name}</h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="pdp-rating-row">
              <span className="rating">
                {product.rating}
                <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </span>
              <span className="pdp-rating-count">{product.ratingCount?.toLocaleString()} Ratings</span>
              <button className="pdp-see-reviews-btn" onClick={() => document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' })}>
                See all reviews →
              </button>
            </div>
          )}

          {/* Price */}
          <div className="pdp-price-block">
            <span className="pdp-price">₹{product.price}</span>
            {product.originalPrice > product.price && <span className="pdp-original-price">₹{product.originalPrice}</span>}
            {product.discountPercent > 0 && <span className="pdp-discount">{product.discountPercent}% OFF</span>}
          </div>
          <p className="pdp-tax-note">inclusive of all taxes</p>

          {/* Color variants */}
          {product.colors?.length > 1 && (
            <div className="pdp-colors">
              <span className="pdp-colors-label">Colors:</span>
              <div className="pdp-color-dots">
                {product.colors.slice(0, 8).map((c, i) => (
                  <div key={i} className="pdp-color-dot" title={c} style={{ background: c.toLowerCase() === 'white' ? '#f0f0f0' : c.toLowerCase() === 'black' ? '#111' : c.toLowerCase() }} />
                ))}
              </div>
            </div>
          )}

          {/* Offers */}
          <div className="pdp-offers">
            <div className="pdp-offer-card"><span className="offer-icon">🏷️</span><div><strong>Buy 3 & Get Extra 15% OFF</strong><span>Use code: BEWAKOOF15</span></div></div>
            <div className="pdp-offer-card"><span className="offer-icon">🚚</span><div><strong>Free Delivery on orders above ₹399</strong></div></div>
          </div>

          {/* Size Selector */}
          <div className={`pdp-size-section ${sizeError ? 'error' : ''}`}>
            <div className="pdp-size-header">
              <span className="pdp-size-label">Select Size</span>
              <button className="pdp-size-guide" onClick={() => setShowSizeGuide(true)}>📏 Size Guide</button>
            </div>
            {sizeError && <p className="pdp-size-error">⚠️ Please select a size</p>}
            <div className="pdp-size-grid">
              {inStockSizes.map(({ size }) => (
                <button key={size} className={`pdp-size-btn ${selectedSize === size ? 'active' : ''}`} onClick={() => { setSelectedSize(size); setSizeError(false); }}>{size}</button>
              ))}
              {outOfStockSizes.map(({ size }) => (
                <button key={size} className="pdp-size-btn out-of-stock" disabled>{size}</button>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="pdp-ctas">
            <button className="btn btn-outline pdp-wishlist-btn" onClick={handleWishlist}>
              <svg viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {wished ? 'Wishlisted' : 'Wishlist'}
            </button>
            <button className="btn btn-primary btn-full" onClick={handleAddToCart} disabled={addingToCart}>
              {addingToCart ? 'Adding...' : '🛍️ Add to Bag'}
            </button>
          </div>
          <button className="btn btn-yellow btn-full pdp-buy-now" onClick={handleBuyNow}>⚡ Buy Now</button>

          {/* Pincode Delivery Checker */}
          <div className="pdp-pincode-checker">
            <h4>🚚 Check Delivery Estimate</h4>
            <form onSubmit={handleCheckPincode} className="pincode-form">
              <input
                type="text"
                className="form-control pincode-input"
                placeholder="Enter 6-digit Pincode"
                value={pincode}
                onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
              <button type="submit" className="btn btn-outline pincode-btn" disabled={checkingPincode || pincode.length !== 6}>
                {checkingPincode ? 'Checking...' : 'Check'}
              </button>
            </form>
            {deliveryStatus?.error && <p className="pincode-error">⚠️ {deliveryStatus.error}</p>}
            {deliveryStatus && !deliveryStatus.error && (
              <div className="pincode-results">
                <p>🚚 Expected Delivery by <strong>{deliveryStatus.date}</strong></p>
                <p>{deliveryStatus.cod ? '💵 Cash on Delivery Available' : '🚫 COD Not Available for this location'}</p>
                <p>✨ Free Shipping on orders above ₹399</p>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="pdp-description">
              <h3>Product Details</h3>
              <p dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br>') }} />
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="pdp-tags">
              {product.tags.map(tag => <span key={tag} className="pdp-tag">#{tag}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* ============ REVIEWS SECTION ============ */}
      <section id="reviews-section" className="pdp-reviews-section">
        <div className="reviews-header">
          <h2 className="reviews-title">Ratings & Reviews</h2>
          {isAuthenticated && !showReviewForm && (
            <button className="btn btn-outline" onClick={() => setShowReviewForm(true)}>✍️ Write a Review</button>
          )}
        </div>

        {/* Rating summary */}
        {reviewTotal > 0 && (
          <div className="reviews-summary">
            <div className="reviews-avg">
              <div className="avg-number">{avgRating}</div>
              <StarRating rating={Math.round(avgRating)} />
              <div className="avg-count">{reviewTotal.toLocaleString()} reviews</div>
            </div>
            <div className="reviews-breakdown">
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviewBreakdown[star] || 0;
                const pct = totalBreakdownCount ? Math.round((count / totalBreakdownCount) * 100) : 0;
                return (
                  <div key={star} className="breakdown-row">
                    <span className="breakdown-star">{star} ★</span>
                    <div className="breakdown-bar"><div className="breakdown-fill" style={{ width: `${pct}%` }} /></div>
                    <span className="breakdown-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Write review form */}
        {showReviewForm && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3>Your Review</h3>
            <div className="review-form-rating">
              <label>Rating:</label>
              <StarRating rating={reviewRating} onRate={setReviewRating} interactive />
            </div>
            <input className="form-control" placeholder="Review Title (optional)" value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} style={{ marginBottom: 12 }} />
            <textarea className="form-control review-textarea" placeholder="Share your experience with this product..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} required rows={4} />
            <div className="review-form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowReviewForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submittingReview}>{submittingReview ? 'Submitting...' : 'Submit Review'}</button>
            </div>
          </form>
        )}

        {/* Reviews list */}
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review._id} className="review-card">
                <div className="review-card-header">
                  <div className="review-avatar">{review.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="review-name">{review.name}</div>
                    <StarRating rating={review.rating} />
                  </div>
                  <div className="review-date">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                {review.title && <div className="review-title">{review.title}</div>}
                <p className="review-comment">{review.comment}</p>
                {review.verified && <span className="verified-badge">✅ Verified Purchase</span>}
              </div>
            ))}
            {reviews.length < reviewTotal && (
              <button className="load-more-reviews-btn" onClick={() => setReviewPage(p => p + 1)}>
                Load More Reviews ({reviewTotal - reviews.length} remaining)
              </button>
            )}
          </div>
        ) : (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this product!</p>
            {isAuthenticated && <button className="btn btn-outline" onClick={() => setShowReviewForm(true)}>Write First Review</button>}
          </div>
        )}
      </section>

      {/* ============ SIMILAR PRODUCTS ============ */}
      {similarProducts.length > 0 && (
        <section className="pdp-similar-section">
          <h2 className="similar-title">You May Also Like</h2>
          <div className="similar-grid">
            {similarProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
