import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './OrdersPage.css';

const API = '/api';

const STATUS_COLORS = {
  placed: '#2196F3', confirmed: '#9C27B0', shipped: '#FF9800',
  out_for_delivery: '#FF5722', delivered: '#4CAF50', cancelled: '#F44336',
};

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    axios.get(`${API}/orders`).then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (loading) return <div className="orders-page container"><div className="skeleton" style={{ height: 200, borderRadius: 8 }} /></div>;

  if (orders.length === 0) return (
    <div className="orders-page container">
      <div className="orders-empty">
        <div>📦</div>
        <h2>No orders yet</h2>
        <Link to="/" className="btn btn-primary">Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="orders-page container">
      <h1 className="orders-title">My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div>
                <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
              <span className="order-status" style={{ background: STATUS_COLORS[order.status] }}>
                {order.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
            <div className="order-items-preview">
              {order.items?.map((item, i) => (
                <div key={i} className="order-item-row">
                  {item.image && <img src={item.image} alt={item.name} className="order-item-img" />}
                  <div>
                    <p className="order-item-name">{item.name}</p>
                    <p className="order-item-meta">Size: {item.size} · Qty: {item.quantity} · ₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-card-footer">
              <strong>Total: ₹{order.totalPrice}</strong>
              <span className="order-payment-status">{order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
