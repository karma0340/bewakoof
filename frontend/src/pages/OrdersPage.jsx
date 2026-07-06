import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './OrdersPage.css';

const baseUrl = import.meta.env.VITE_API_URL || '';
const API = baseUrl ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/api`) : '/api';

const STATUS_STEPS = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];

const STATUS_CONFIG = {
  placed: { label: 'Order Placed', color: '#1E88E5', bg: '#E3F2FD', icon: '📋' },
  confirmed: { label: 'Confirmed', color: '#7B1FA2', bg: '#F3E5F5', icon: '✅' },
  shipped: { label: 'Shipped', color: '#E65100', bg: '#FFF3E0', icon: '🚚' },
  out_for_delivery: { label: 'Out for Delivery', color: '#F4511E', bg: '#FBE9E7', icon: '🏍️' },
  delivered: { label: 'Delivered', color: '#2E7D32', bg: '#E8F5E9', icon: '📦' },
  cancelled: { label: 'Cancelled', color: '#C62828', bg: '#FFEBEE', icon: '❌' },
  returned: { label: 'Returned', color: '#4E342E', bg: '#EFEBE9', icon: '🔄' },
};

const MiniTracker = ({ status }) => {
  const currentIdx = STATUS_STEPS.indexOf(status);
  if (currentIdx === -1) return null;
  return (
    <div className="mini-tracker">
      {STATUS_STEPS.map((s, i) => (
        <div key={s} className={`mini-step ${i <= currentIdx ? 'done' : ''} ${i === currentIdx ? 'current' : ''}`}>
          <div className="mini-dot" title={STATUS_CONFIG[s]?.label} />
          {i < STATUS_STEPS.length - 1 && <div className={`mini-line ${i < currentIdx ? 'filled' : ''}`} />}
        </div>
      ))}
    </div>
  );
};

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    axios.get(`${API}/orders`).then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return (
    <div className="orders-page container">
      {[1, 2, 3].map(i => (
        <div key={i} className="order-skeleton" />
      ))}
    </div>
  );

  if (orders.length === 0) return (
    <div className="orders-page container">
      <div className="orders-empty">
        <div className="orders-empty-icon">📦</div>
        <h2>No orders yet</h2>
        <p>Looks like you haven't placed any orders. Start shopping!</p>
        <Link to="/" className="btn btn-primary">Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="orders-page container">
      <div className="orders-header">
        <h1 className="orders-title">My Orders ({orders.length})</h1>
        <div className="orders-filter-tabs">
          {['all', 'placed', 'shipped', 'delivered', 'cancelled'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label || f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="orders-empty" style={{ marginTop: 40 }}>
          <p>No orders with status "{filter}"</p>
        </div>
      ) : (
        <div className="orders-list">
          {filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed;
            const isCancelled = order.status === 'cancelled';
            const isDelivered = order.status === 'delivered';

            return (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-card-id-wrap">
                    <span className="order-id-label">Order ID</span>
                    <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <span
                    className="order-status-chip"
                    style={{ color: cfg.color, background: cfg.bg }}
                  >
                    {cfg.icon} {cfg.label}
                  </span>
                </div>

                {/* Mini progress tracker */}
                {!isCancelled && <MiniTracker status={order.status} />}

                {/* Items preview */}
                <div className="order-items-preview">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <div key={i} className="order-item-row">
                      <img
                        src={item.image || 'https://via.placeholder.com/56x70'}
                        alt={item.name}
                        className="order-item-img"
                        onError={e => e.target.style.opacity = 0}
                      />
                      <div className="order-item-details">
                        <p className="order-item-name">{item.name}</p>
                        <p className="order-item-meta">Size: <strong>{item.size}</strong> · Qty: {item.quantity}</p>
                        <p className="order-item-price">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <p className="more-items">+{order.items.length - 3} more items</p>
                  )}
                </div>

                <div className="order-card-footer">
                  <div className="order-footer-left">
                    <span className="order-total">Total: <strong>₹{order.totalPrice}</strong></span>
                    <span className={`order-pay-status ${order.paymentStatus === 'paid' ? 'paid' : 'pending'}`}>
                      {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                    </span>
                  </div>
                  <div className="order-footer-actions">
                    <Link to={`/order/${order._id}`} className="btn btn-outline order-detail-btn">
                      View Details
                    </Link>
                    {isDelivered && (
                      <button className="btn btn-outline return-btn" onClick={() => alert('Return request initiated')}>
                        Return
                      </button>
                    )}
                  </div>
                </div>

                {!isCancelled && !isDelivered && (
                  <div className="order-delivery-estimate">
                    🚀 Estimated delivery: {(() => {
                      const d = new Date(order.createdAt);
                      d.setDate(d.getDate() + 5);
                      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
