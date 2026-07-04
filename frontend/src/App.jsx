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
import SearchPage from './pages/SearchPage';
import './index.css';

// Simple route wrapper to pass props to ProductListPage
const MenPage = () => (
  <ProductListPage
    gender="men"
    title="Clothes for Men"
    bannerSrc="/banner-men.webp"
  />
);
const WomenPage = () => (
  <ProductListPage
    gender="women"
    title="Clothes for Women"
    bannerSrc="/banner-women.jpeg"
  />
);
const AccessoriesPage = () => (
  <ProductListPage
    gender="unisex"
    title="Accessories"
    bannerSrc={null}
  />
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
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
                <Route path="*" element={
                  <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                    <h1 style={{ fontSize: 80 }}>404</h1>
                    <p>Page not found</p>
                    <a href="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 20 }}>Go Home</a>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
