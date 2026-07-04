import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './CartPage.css';

const CartPage = () => {
  const { cart, cartTotal, updateCartItem, removeFromCart, cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const shippingFee = cartTotal >= 399 ? 0 : 49;
  const totalWithShipping = cartTotal + shippingFee;

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
    showToast('Item removed from cart');
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-page container">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛍️</div>
          <h2>Your bag is empty</h2>
          <p>Login to see your saved items</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  if (cartLoading) return (
    <div className="cart-page container">
      <div className="skeleton" style={{ height: 300, borderRadius: 8 }} />
    </div>
  );

  if (cart.length === 0) return (
    <div className="cart-page container">
      <div className="cart-empty">
        <div className="cart-empty-icon">🛍️</div>
        <h2>Your bag is empty!</h2>
        <p>Add some bewakoof stuff to your bag</p>
        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="cart-page container">
      <h1 className="cart-title">My Bag ({cart.length} items)</h1>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {cart.map((item) => {
            const p = item.product;
            if (!p) return null;
            return (
              <div key={item._id} className="cart-item">
                <Link to={`/product/${p._id}`} className="cart-item-img">
                  <img src={p.images?.[0]} alt={p.name} />
                </Link>
                <div className="cart-item-details">
                  <Link to={`/product/${p._id}`} className="cart-item-name">{p.name}</Link>
                  <div className="cart-item-meta">
                    <span>Size: <strong>{item.size}</strong></span>
                    {p.color && <span>Color: <strong>{p.color}</strong></span>}
                  </div>
                  <div className="cart-item-price">
                    <span className="price-current">₹{p.price}</span>
                    {p.originalPrice > p.price && <span className="price-original">₹{p.originalPrice}</span>}
                    {p.discountPercent > 0 && <span className="price-discount">{p.discountPercent}% OFF</span>}
                  </div>
                  <div className="cart-item-qty">
                    <button
                      className="qty-btn"
                      onClick={() => updateCartItem(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateCartItem(item._id, item.quantity + 1)}
                    >+</button>
                    <button className="cart-remove-btn" onClick={() => handleRemove(item._id)}>Remove</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h3 className="cart-summary-title">Price Details</h3>
          <div className="summary-row">
            <span>Price ({cart.length} items)</span>
            <span>₹{cartTotal}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Charges</span>
            <span className={shippingFee === 0 ? 'free-ship' : ''}>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
          </div>
          {shippingFee > 0 && (
            <p className="free-ship-note">Add items worth ₹{399 - cartTotal} more for free delivery!</p>
          )}
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total Amount</span>
            <strong>₹{totalWithShipping}</strong>
          </div>
          <div className="summary-savings">
            You save ₹{cart.reduce((s, i) => s + ((i.product?.originalPrice || 0) - (i.product?.price || 0)) * i.quantity, 0)} on this order!
          </div>
          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: 20 }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
