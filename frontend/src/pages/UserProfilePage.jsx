import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import './UserProfilePage.css';

const baseUrl = import.meta.env.VITE_API_URL || '';
const API = baseUrl ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/api`) : '/api';

const STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

const UserProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ name: '', phone: '' });
  const [addresses, setAddresses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editAddrId, setEditAddrId] = useState(null);
  const [addrForm, setAddrForm] = useState({ name: '', phone: '', street: '', city: '', state: '', pincode: '', type: 'home', isDefault: false });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user) setProfile({ name: user.name || '', phone: user.phone || '' });
    loadAddresses();
  }, [isAuthenticated, user]);

  const loadAddresses = async () => {
    try {
      const { data } = await axios.get(`${API}/users/me/addresses`);
      setAddresses(data);
    } catch {}
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API}/users/me`, profile);
      showToast('Profile updated!', 'success');
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      if (editAddrId) {
        await axios.put(`${API}/users/me/addresses/${editAddrId}`, addrForm);
        showToast('Address updated!', 'success');
      } else {
        await axios.post(`${API}/users/me/addresses`, addrForm);
        showToast('Address added!', 'success');
      }
      setShowAddrForm(false);
      setEditAddrId(null);
      setAddrForm({ name: '', phone: '', street: '', city: '', state: '', pincode: '', type: 'home', isDefault: false });
      loadAddresses();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving address', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await axios.delete(`${API}/users/me/addresses/${id}`);
      showToast('Address deleted', 'success');
      loadAddresses();
    } catch { showToast('Failed to delete', 'error'); }
  };

  const startEditAddress = (addr) => {
    setEditAddrId(addr._id);
    setAddrForm({ name: addr.name, phone: addr.phone, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode, type: addr.type, isDefault: addr.isDefault });
    setShowAddrForm(true);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <div className="profile-avatar-section">
          <div className="profile-avatar-circle">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h3 className="profile-name">{user?.name}</h3>
          <p className="profile-email">{user?.email}</p>
        </div>
        <nav className="profile-nav">
          {[
            { key: 'profile', label: '👤 My Profile', },
            { key: 'addresses', label: '📍 Saved Addresses' },
            { key: 'orders', label: '📦 My Orders', action: () => navigate('/orders') },
          ].map(item => (
            <button
              key={item.key}
              className={`profile-nav-item ${tab === item.key ? 'active' : ''}`}
              onClick={item.action || (() => setTab(item.key))}
            >
              {item.label}
            </button>
          ))}
          <button className="profile-nav-item logout-btn" onClick={() => { logout(); navigate('/'); }}>
            🚪 Logout
          </button>
        </nav>
      </div>

      <div className="profile-content">
        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="profile-section">
            <h2 className="section-heading">My Profile</h2>
            <form onSubmit={handleProfileSave} className="profile-form">
              <div className="profile-form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-control" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-control" type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="Enter phone number" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: 20 }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            <div className="account-stats">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-val" onClick={() => navigate('/orders')} style={{ cursor: 'pointer' }}>View Orders</div>
                <div className="stat-label">All Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">❤️</div>
                <div className="stat-val" onClick={() => navigate('/wishlist')} style={{ cursor: 'pointer' }}>Wishlist</div>
                <div className="stat-label">Saved Items</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📍</div>
                <div className="stat-val">{addresses.length}</div>
                <div className="stat-label">Addresses</div>
              </div>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {tab === 'addresses' && (
          <div className="profile-section">
            <div className="section-header-row">
              <h2 className="section-heading">Saved Addresses</h2>
              <button className="btn btn-outline" onClick={() => { setShowAddrForm(true); setEditAddrId(null); setAddrForm({ name: '', phone: '', street: '', city: '', state: '', pincode: '', type: 'home', isDefault: false }); }}>
                + Add New
              </button>
            </div>

            {showAddrForm && (
              <form onSubmit={handleAddAddress} className="addr-form-card">
                <h3 className="addr-form-title">{editAddrId ? 'Edit Address' : 'New Address'}</h3>
                <div className="address-grid-2">
                  {[{ label: 'Full Name', field: 'name' }, { label: 'Phone', field: 'phone' }, { label: 'Street / Flat / Area', field: 'street' }, { label: 'City', field: 'city' }, { label: 'PIN Code', field: 'pincode' }].map(({ label, field }) => (
                    <div key={field} className="form-group">
                      <label className="form-label">{label}</label>
                      <input className="form-control" value={addrForm[field]} onChange={e => setAddrForm({ ...addrForm, [field]: e.target.value })} required />
                    </div>
                  ))}
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <select className="form-control" value={addrForm.state} onChange={e => setAddrForm({ ...addrForm, state: e.target.value })} required>
                      <option value="">Select State</option>
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-control" value={addrForm.type} onChange={e => setAddrForm({ ...addrForm, type: e.target.value })}>
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <label className="default-check">
                  <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm({ ...addrForm, isDefault: e.target.checked })} />
                  &nbsp;Set as default address
                </label>
                <div className="addr-form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowAddrForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Address</button>
                </div>
              </form>
            )}

            {addresses.length === 0 && !showAddrForm ? (
              <div className="empty-addresses">
                <div style={{ fontSize: 60 }}>📍</div>
                <p>No saved addresses yet.</p>
                <button className="btn btn-primary" onClick={() => setShowAddrForm(true)}>Add First Address</button>
              </div>
            ) : (
              <div className="addr-list">
                {addresses.map(addr => (
                  <div key={addr._id} className={`addr-card ${addr.isDefault ? 'default-addr' : ''}`}>
                    <div className="addr-card-top">
                      <span className={`addr-type addr-type-${addr.type}`}>{addr.type}</span>
                      {addr.isDefault && <span className="default-chip">Default</span>}
                    </div>
                    <p className="addr-card-name">{addr.name} · {addr.phone}</p>
                    <p className="addr-card-text">{addr.street}, {addr.city}, {addr.state} — {addr.pincode}</p>
                    <div className="addr-card-actions">
                      <button className="addr-action-btn" onClick={() => startEditAddress(addr)}>✏️ Edit</button>
                      <button className="addr-action-btn delete" onClick={() => handleDeleteAddress(addr._id)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
