import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './OrderDetailPage.css';

const baseUrl = import.meta.env.VITE_API_URL || '';
const API = baseUrl ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/api`) : '/api';

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', icon: '📋', desc: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', desc: 'Seller confirmed your order' },
  { key: 'shipped', label: 'Shipped', icon: '🚚', desc: 'Your order is on the way' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🏍️', desc: 'Arriving today!' },
  { key: 'delivered', label: 'Delivered', icon: '📦', desc: 'Delivered to you' },
];

const STATUS_ORDER = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    axios.get(`${API}/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await axios.put(`${API}/orders/${id}/cancel`);
      const { data } = await axios.get(`${API}/orders/${id}`);
      setOrder(data);
    } catch {
      alert('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return (
    <div className="order-detail-page">
      <div className="od-skeleton">
        {[1,2,3].map(i => <div key={i} className="od-skeleton-row" />)}
      </div>
    </div>
  );

  if (!order) return null;

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  const estimatedDate = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
    : (() => {
        const d = new Date(order.createdAt);
        d.setDate(d.getDate() + 5);
        return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
      })();

  return (
    <div className="order-detail-page">
      {/* Header */}
      <div className="od-header">
        <button className="od-back-btn" onClick={() => navigate('/orders')}>← Back to Orders</button>
        <div className="od-header-info">
          <h1 className="od-title">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <span className="od-date">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <span className={`od-status-badge status-${order.status}`}>{order.status.replace('_', ' ').toUpperCase()}</span>
      </div>

      {/* Tracking Timeline */}
      {!isCancelled && (
        <div className="od-tracker-card">
          <h2 className="od-card-title">📍 Order Tracking</h2>
          {order.status !== 'cancelled' && (
            <p className="od-delivery-est">
              {order.status === 'delivered'
                ? `✅ Delivered on ${order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('en-IN') : 'recently'}`
                : `🚀 Estimated delivery: ${estimatedDate}`}
            </p>
          )}
          <div className="od-tracker">
            {STATUS_STEPS.map((step, i) => {
              const isDone = currentStatusIndex >= i;
              const isCurrent = currentStatusIndex === i;
              return (
                <div key={step.key} className={`od-track-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="od-step-connector-wrap">
                    <div className={`od-step-circle ${isDone ? 'filled' : ''}`}>
                      {isDone ? (i < currentStatusIndex ? '✓' : step.icon) : <span className="od-step-num">{i + 1}</span>}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`od-step-line ${currentStatusIndex > i ? 'filled' : ''}`} />
                    )}
                  </div>
                  <div className="od-step-info">
                    <div className="od-step-label">{step.label}</div>
                    {isCurrent && <div className="od-step-desc">{step.desc}</div>}
                    {order.statusHistory?.find(h => h.status === step.key) && (
                      <div className="od-step-time">
                        {new Date(order.statusHistory.find(h => h.status === step.key).timestamp).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="od-cancelled-banner">
          ❌ This order has been cancelled. {order.cancelReason && `Reason: ${order.cancelReason}`}
        </div>
      )}

      <div className="od-body">
        {/* Items */}
        <div className="od-items-card">
          <h2 className="od-card-title">🛍️ Items Ordered</h2>
          {order.items.map((item, idx) => (
            <div key={idx} className="od-item">
              <img
                src={item.image || item.product?.images?.[0] || 'https://via.placeholder.com/80'}
                alt={item.name}
                className="od-item-img"
              />
              <div className="od-item-info">
                <Link to={`/product/${item.product?._id || item.product}`} className="od-item-name">
                  {item.name || item.product?.name}
                </Link>
                <div className="od-item-meta">Size: {item.size} · Qty: {item.quantity}</div>
                <div className="od-item-price">₹{item.price} each</div>
              </div>
              <div className="od-item-total">₹{item.price * item.quantity}</div>
            </div>
          ))}
        </div>

        <div className="od-right-col">
          {/* Delivery Address */}
          <div className="od-address-card">
            <h2 className="od-card-title">📍 Delivery Address</h2>
            <p className="od-addr-name">{order.shippingAddress?.name}</p>
            <p className="od-addr-phone">📞 {order.shippingAddress?.phone}</p>
            <p className="od-addr-text">{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
          </div>

          {/* Price Breakdown */}
          <div className="od-price-card">
            <h2 className="od-card-title">💰 Price Details</h2>
            <div className="od-price-row"><span>Items Total</span><span>₹{order.itemsPrice}</span></div>
            <div className="od-price-row"><span>Delivery</span><span className={order.shippingPrice === 0 ? 'free-label' : ''}>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
            {order.discount > 0 && <div className="od-price-row discount"><span>Coupon ({order.couponCode})</span><span>−₹{order.discount}</span></div>}
            <div className="od-price-divider" />
            <div className="od-price-row total"><span>Total Paid</span><strong>₹{order.totalPrice}</strong></div>
            <div className="od-price-row"><span>Payment</span><span className="od-pay-badge">{order.paymentMethod === 'razorpay' ? '💳 Razorpay' : '💰 Paid'}</span></div>
          </div>

          {/* Actions */}
          {order.status === 'placed' && !isCancelled && (
            <button className="od-cancel-btn" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? 'Cancelling...' : '❌ Cancel Order'}
            </button>
          )}
          {order.status === 'delivered' && (
            <button className="od-return-btn" onClick={() => alert('Return request submitted!')}>
              🔄 Return / Exchange
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
