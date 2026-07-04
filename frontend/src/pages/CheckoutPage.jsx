import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import './CheckoutPage.css';

const baseUrl = import.meta.env.VITE_API_URL || '';
const API = baseUrl ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/api`) : '/api';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=address, 2=review, 3=success
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: '', phone: '', street: '', city: '', state: '', pincode: '',
  });
  const [orderId, setOrderId] = useState(null);

  const shippingFee = cartTotal >= 399 ? 0 : 49;
  const totalPrice = cartTotal + shippingFee;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const items = cart.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0],
        size: item.size,
        quantity: item.quantity,
        price: item.product.price,
      }));
      const { data } = await axios.post(`${API}/orders`, {
        items, shippingAddress: address,
        itemsPrice: cartTotal,
        shippingPrice: shippingFee,
        totalPrice,
      });
      setOrderId(data._id);
      await clearCart();
      setStep(3);
      showToast('🎉 Order placed successfully!', 'success');
    } catch (err) {
      showToast('Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) { navigate('/login'); return null; }

  return (
    <div className="checkout-page container">
      {/* Steps Indicator */}
      <div className="checkout-steps">
        {['Address', 'Review & Pay', 'Confirmed'].map((s, i) => (
          <div key={s} className={`checkout-step ${step > i ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
            <div className="step-circle">{step > i + 1 ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Address */}
      {step === 1 && (
        <form onSubmit={handleAddressSubmit} className="checkout-address">
          <h2 className="checkout-section-title">Delivery Address</h2>
          <div className="address-grid">
            {[
              { label: 'Full Name', field: 'name', type: 'text', required: true },
              { label: 'Phone Number', field: 'phone', type: 'tel', required: true },
              { label: 'Street / Apartment', field: 'street', type: 'text', required: true },
              { label: 'City', field: 'city', type: 'text', required: true },
              { label: 'State', field: 'state', type: 'text', required: true },
              { label: 'PIN Code', field: 'pincode', type: 'text', required: true },
            ].map(({ label, field, type, required }) => (
              <div key={field} className="form-group">
                <label className="form-label">{label}</label>
                <input
                  type={type}
                  className="form-control"
                  value={address[field]}
                  onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                  required={required}
                />
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary">Continue to Review</button>
        </form>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <div className="checkout-review">
          <div className="checkout-review-layout">
            <div>
              <h2 className="checkout-section-title">Order Summary</h2>
              <div className="review-items">
                {cart.map((item) => (
                  <div key={item._id} className="review-item">
                    <img src={item.product?.images?.[0]} alt={item.product?.name} className="review-item-img" />
                    <div className="review-item-info">
                      <p className="review-item-name">{item.product?.name}</p>
                      <p className="review-item-meta">Size: {item.size} · Qty: {item.quantity}</p>
                      <p className="review-item-price">₹{item.product?.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="review-address-card">
                <h4>Delivering to</h4>
                <p>{address.name} · {address.phone}</p>
                <p>{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                <button className="checkout-edit-btn" onClick={() => setStep(1)}>Change</button>
              </div>
            </div>

            <div className="checkout-pay-card">
              <h3>Payment Summary</h3>
              <div className="summary-row"><span>Items Total</span><span>₹{cartTotal}</span></div>
              <div className="summary-row"><span>Delivery</span><span className={shippingFee === 0 ? 'free-ship' : ''}>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span></div>
              <div className="summary-divider" />
              <div className="summary-row summary-total"><span>Total</span><strong>₹{totalPrice}</strong></div>
              <div className="mock-pay-badge">💳 Mock Payment (No real charge)</div>
              <button
                className="btn btn-primary btn-full"
                style={{ marginTop: 16 }}
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Pay ₹${totalPrice}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="checkout-success">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>Your order #{orderId?.slice(-8).toUpperCase()} has been confirmed.</p>
          <p className="success-sub">Estimated delivery: 3-5 business days</p>
          <div className="success-actions">
            <button className="btn btn-outline" onClick={() => navigate('/orders')}>View My Orders</button>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
