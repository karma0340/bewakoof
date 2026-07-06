import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import './CheckoutPage.css';

const baseUrl = import.meta.env.VITE_API_URL || '';
const API = baseUrl ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/api`) : '/api';

const INDIAN_STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [address, setAddress] = useState({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const shippingFee = cartTotal >= 399 ? 0 : 49;
  const discount = couponApplied?.discount || 0;
  const totalPrice = cartTotal + shippingFee - discount;

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    // Load saved addresses
    axios.get(`${API}/users/me/addresses`).then(({ data }) => {
      setSavedAddresses(data);
      if (data.length > 0) {
        const def = data.find(a => a.isDefault) || data[0];
        setSelectedAddrId(def._id);
        setAddress({ name: def.name, phone: def.phone, street: def.street, city: def.city, state: def.state, pincode: def.pincode });
      } else {
        if (user) setAddress(a => ({ ...a, name: user.name, phone: user.phone || '' }));
      }
    }).catch(() => {});
  }, [isAuthenticated]);

  const handleAddressSelect = (addr) => {
    setSelectedAddrId(addr._id);
    setAddress({ name: addr.name, phone: addr.phone, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode });
  };

  const handleApplyCoupon = async () => {
    setCouponError('');
    setCouponLoading(true);
    try {
      const { data } = await axios.get(`${API}/users/coupons/validate?code=${couponCode}&amount=${cartTotal + shippingFee}`);
      setCouponApplied(data);
      showToast(`✅ Coupon applied! You save ₹${data.discount}`, 'success');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon');
      setCouponApplied(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(null);
    setCouponCode('');
    setCouponError('');
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src*="razorpay"]')) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayWithRazorpay = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) { showToast('Razorpay failed to load', 'error'); return; }

      const { data: rpOrder } = await axios.post(`${API}/payment/create-order`, {
        amount: totalPrice,
        receipt: `rcpt_${Date.now()}`,
      });

      const options = {
        key: rpOrder.keyId,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        name: 'Bewakoof®',
        description: 'Bewakoof Order Payment',
        image: '/logo-bk.png',
        order_id: rpOrder.orderId,
        handler: async (response) => {
          try {
            const items = cart.map(item => ({
              product: item.product._id,
              name: item.product.name,
              image: item.product.images?.[0] || '',
              size: item.size,
              quantity: item.quantity,
              price: item.product.price,
            }));
            const { data: order } = await axios.post(`${API}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                items, shippingAddress: address,
                itemsPrice: cartTotal,
                shippingPrice: shippingFee,
                discount,
                couponCode: couponApplied?.coupon?.code || '',
                totalPrice,
              },
            });
            setOrderId(order.order._id);
            await clearCart();
            setStep(3);
            showToast('🎉 Payment successful! Order placed.', 'success');
          } catch {
            showToast('Order creation failed after payment', 'error');
          }
        },
        prefill: { name: address.name, contact: address.phone, email: user?.email || '' },
        notes: { address: `${address.street}, ${address.city}` },
        theme: { color: '#FFCC00' },
        modal: { ondismiss: () => setLoading(false) },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      showToast('Payment failed: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;
  if (cart.length === 0 && step !== 3) {
    return (
      <div className="checkout-page container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 60 }}>🛒</div>
        <h2>Your cart is empty</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Shop Now</button>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      {/* Steps Indicator */}
      <div className="checkout-steps">
        {['Delivery Address', 'Order Summary', 'Confirmed'].map((s, i) => (
          <div key={s} className={`checkout-step ${step > i ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
            <div className="step-circle">{step > i + 1 ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Address */}
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="checkout-address">
          <h2 className="checkout-section-title">Delivery Address</h2>

          {/* Saved addresses */}
          {savedAddresses.length > 0 && (
            <div className="saved-addresses-section">
              <h3 className="saved-addr-heading">Saved Addresses</h3>
              <div className="saved-addr-list">
                {savedAddresses.map(addr => (
                  <label key={addr._id} className={`saved-addr-card ${selectedAddrId === addr._id ? 'selected' : ''}`}>
                    <input type="radio" name="savedAddr" checked={selectedAddrId === addr._id} onChange={() => handleAddressSelect(addr)} />
                    <div className="saved-addr-body">
                      <span className="saved-addr-name">{addr.name}</span>
                      {addr.isDefault && <span className="default-badge">Default</span>}
                      <span className={`addr-type-badge type-${addr.type}`}>{addr.type}</span>
                      <p className="saved-addr-text">{addr.street}, {addr.city}, {addr.state} — {addr.pincode}</p>
                      <p className="saved-addr-phone">📞 {addr.phone}</p>
                    </div>
                  </label>
                ))}
                <label className={`saved-addr-card ${selectedAddrId === 'new' ? 'selected' : ''}`}>
                  <input type="radio" name="savedAddr" checked={selectedAddrId === 'new'} onChange={() => { setSelectedAddrId('new'); setAddress({ name: '', phone: '', street: '', city: '', state: '', pincode: '' }); }} />
                  <div className="saved-addr-body">
                    <span className="saved-addr-name">+ Add New Address</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Address form */}
          {(savedAddresses.length === 0 || selectedAddrId === 'new') && (
            <div className="address-grid">
              {[
                { label: 'Full Name', field: 'name', type: 'text', required: true },
                { label: 'Phone Number', field: 'phone', type: 'tel', required: true },
                { label: 'Street / Apartment', field: 'street', type: 'text', required: true },
                { label: 'City', field: 'city', type: 'text', required: true },
              ].map(({ label, field, type, required }) => (
                <div key={field} className="form-group">
                  <label className="form-label">{label}</label>
                  <input type={type} className="form-control" value={address[field]} onChange={e => setAddress({ ...address, [field]: e.target.value })} required={required} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">State</label>
                <select className="form-control" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} required>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">PIN Code</label>
                <input type="text" className="form-control" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} required pattern="\d{6}" maxLength={6} />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: 24 }}>Continue to Review</button>
        </form>
      )}

      {/* Step 2: Review & Pay */}
      {step === 2 && (
        <div className="checkout-review">
          <div className="checkout-review-layout">
            {/* Left: Items + Coupon + Address */}
            <div className="checkout-review-left">
              <h2 className="checkout-section-title">Order Items ({cart.length})</h2>
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

              {/* Coupon Code */}
              <div className="coupon-section">
                <h3 className="coupon-title">🏷️ Apply Coupon</h3>
                {couponApplied ? (
                  <div className="coupon-applied">
                    <span>✅ <strong>{couponApplied.coupon.code}</strong> — ₹{couponApplied.discount} saved!</span>
                    <button className="remove-coupon-btn" onClick={removeCoupon}>Remove</button>
                  </div>
                ) : (
                  <div className="coupon-input-row">
                    <input type="text" className="form-control coupon-input" placeholder="Enter coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} />
                    <button className="btn btn-outline coupon-apply-btn" onClick={handleApplyCoupon} disabled={!couponCode || couponLoading}>
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <p className="coupon-error">{couponError}</p>}
                <div className="available-coupons">
                  <p className="avail-label">Available offers:</p>
                  {['WELCOME10', 'FLAT100', 'BEWAKOOF20', 'SALE15'].map(c => (
                    <button key={c} className="avail-coupon-tag" onClick={() => { setCouponCode(c); setCouponError(''); }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="review-address-card">
                <h4>📍 Delivering to</h4>
                <p><strong>{address.name}</strong> · {address.phone}</p>
                <p>{address.street}, {address.city}, {address.state} — {address.pincode}</p>
                <button className="checkout-edit-btn" onClick={() => setStep(1)}>Change</button>
              </div>
            </div>

            {/* Right: Payment Summary */}
            <div className="checkout-pay-card">
              <h3>Payment Summary</h3>
              <div className="summary-row"><span>Items Total ({cart.length})</span><span>₹{cartTotal}</span></div>
              <div className="summary-row"><span>Delivery</span><span className={shippingFee === 0 ? 'free-ship' : ''}>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span></div>
              {discount > 0 && <div className="summary-row discount-row"><span>Coupon Discount</span><span>−₹{discount}</span></div>}
              <div className="summary-divider" />
              <div className="summary-row summary-total"><span>Total Amount</span><strong>₹{totalPrice}</strong></div>
              {discount > 0 && <div className="savings-banner">🎉 You're saving ₹{discount} on this order!</div>}

              <div className="payment-methods-row">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Razorpay_logo.svg/320px-Razorpay_logo.svg.png" alt="Razorpay" className="razorpay-logo" />
                <div className="payment-icons-list">
                  {['UPI', 'Card', 'NetBanking', 'Wallet', 'EMI'].map(m => (
                    <span key={m} className="pay-method-pill">{m}</span>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary btn-full pay-btn" onClick={handlePayWithRazorpay} disabled={loading}>
                {loading ? 'Processing...' : `Pay ₹${totalPrice} via Razorpay`}
              </button>

              <div className="secure-badge">🔒 100% Secure Payments · SSL Encrypted</div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="checkout-success">
          <div className="success-animation">
            <div className="success-circle">
              <svg viewBox="0 0 52 52" className="success-check-svg">
                <circle className="success-check-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="success-check-tick" fill="none" d="M14 27l8 8 16-16" />
              </svg>
            </div>
          </div>
          <h2 className="success-title">Order Placed Successfully! 🎉</h2>
          <p className="success-order-id">Order ID: <strong>#{orderId?.slice(-8).toUpperCase()}</strong></p>
          <p className="success-sub">Estimated delivery: 3–5 business days</p>
          <div className="success-actions">
            <button className="btn btn-outline" onClick={() => navigate('/orders')}>Track My Order</button>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
