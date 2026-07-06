import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { LoginPage, RegisterPage } from './pages/AuthPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import SearchPage from './pages/SearchPage';
import UserProfilePage from './pages/UserProfilePage';
import CollaborationsPage from './pages/CollaborationsPage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';
import { useState, useEffect } from 'react';

const MenPage = () => <ProductListPage gender="men" title="Clothes for Men" bannerSrc="/banner-men.webp" />;
const WomenPage = () => <ProductListPage gender="women" title="Clothes for Women" bannerSrc="/banner-women.jpeg" />;
const AccessoriesPage = () => <ProductListPage gender="unisex" title="Accessories" bannerSrc={null} />;

const App = () => {
  const [gender, setGender] = useState(localStorage.getItem('gender') || 'men');

  const handleSetGender = (g) => {
    setGender(g);
    if (g) localStorage.setItem('gender', g);
    else localStorage.removeItem('gender');
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar gender={gender} setGender={handleSetGender} />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage gender={gender} setGender={handleSetGender} />} />
                  <Route path="/men-clothing" element={<MenPage />} />
                  <Route path="/women-clothing" element={<WomenPage />} />
                  <Route path="/accessories" element={<AccessoriesPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/order/:id" element={<OrderDetailPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route path="/collaborations" element={<CollaborationsPage />} />
                  <Route path="/privacy-policy" element={<StaticPage title="Privacy Policy" content="Privacy policy content from bewakoof.com" />} />
                  <Route path="/terms-and-conditions" element={<StaticPage title="Terms & Conditions" content="Terms and conditions content." />} />
                  <Route path="/contact-us" element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <BackToTopButton />
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Global sticky Back-to-Top button
const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setVisible(true);
      else setVisible(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        background: '#111',
        color: '#FFCC00',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
      }}
      className="back-to-top"
      aria-label="Back to top"
    >
      ↑
    </button>
  );
};

// Simple static page wrapper
const StaticPage = ({ title, content }) => (
  <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>{title}</h1>
    <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
      <p>This page contains our {title.toLowerCase()} information. For the complete and latest version, please visit <a href="https://www.bewakoof.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-orange)' }}>bewakoof.com</a>.</p>
    </div>
  </div>
);

// Contact page
const ContactPage = () => (
  <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 80px' }}>
    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Contact Us</h1>
    <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>We're here to help! Reach out to us.</p>
    <div style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
      {[
        { icon: '📧', label: 'Email', value: 'support@bewakoof.com' },
        { icon: '📞', label: 'Phone', value: '1800-123-4567 (Toll Free)' },
        { icon: '⏰', label: 'Hours', value: 'Mon–Sat, 10 AM – 7 PM IST' },
        { icon: '🏢', label: 'Office', value: 'Mumbai, Maharashtra, India' },
      ].map(({ icon, label, value }) => (
        <div key={label} style={{ background: 'var(--bg-light)', borderRadius: 10, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 28 }}>{icon}</span>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
            <div style={{ fontWeight: 600 }}>{value}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default App;
