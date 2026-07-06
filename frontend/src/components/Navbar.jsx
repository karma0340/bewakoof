import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import axios from 'axios';
import './Navbar.css';

const baseUrl = import.meta.env.VITE_API_URL || '';
const API = baseUrl ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/api`) : '/api';

/* Sub-nav items — matches real bewakoof.com */
const SUB_NAV = [
  { label: 'LIVE NOW', link: '/men-clothing?sort=newest' },
  { label: 'ACCESSORIES', link: '/accessories' },
  { label: 'PLUS SIZE', link: '/men-clothing?fit=plus-size' },
  { label: 'PARTY ANIMAL', link: '/men-clothing?pattern=graphic' },
  { label: 'SNEAKERS', link: '/accessories?category=sneakers' },
  { label: 'OFFICIAL MERCH', link: '/men-clothing?collaboration=official' },
  { label: 'BEWAKOOF AIR', link: '/men-clothing?collection=air' },
  { label: 'HEAVY DUTY', link: '/men-clothing?collection=heavy-duty' },
  { label: 'SHOP NOW', link: '/men-clothing' },
  { label: 'CUSTOMIZATION', link: '/collaborations' },
];

/* Mega Menu Data for MEN, WOMEN, ACCESSORIES — Matches real bewakoof.com */
const MEGA_MENU_DATA = {
  men: {
    columns: [
      {
        title: 'Topwear',
        items: [
          { label: 'All Topwear', link: '/men-clothing' },
          { label: 'All T-Shirts', link: '/men-clothing?category=t-shirt' },
          { label: 'All Shirts', link: '/men-clothing?category=shirt' },
          { label: 'Polo T-Shirts', link: '/men-clothing?category=polo' },
          { label: 'Oversized T-shirts', link: '/men-clothing?fit=oversized' },
          { label: 'Classic Fit T-shirts', link: '/men-clothing?fit=regular' },
          { label: 'Half Sleeve T-Shirts', link: '/men-clothing?sleeve=half' },
          { label: 'Printed T-Shirts', link: '/men-clothing?pattern=printed' },
          { label: 'Plain T-Shirts', link: '/men-clothing?pattern=solid' },
          { label: 'Vests', link: '/men-clothing?category=vest' },
          { label: 'Hoodies', link: '/men-clothing?category=hoodie' },
        ],
      },
      {
        title: 'Bottomwear',
        highlight: true,
        items: [
          { label: 'All Bottomwear', link: '/men-clothing?category=bottomwear' },
          { label: 'Joggers', link: '/men-clothing?category=joggers' },
          { label: 'Trackpants', link: '/men-clothing?category=trackpants' },
          { label: 'Trousers & Pants', link: '/men-clothing?category=trousers' },
          { label: 'Jeans', link: '/men-clothing?category=jeans' },
          { label: 'Pajamas', link: '/men-clothing?category=pajamas' },
          { label: 'Shorts', link: '/men-clothing?category=shorts' },
          { label: 'Boxers', link: '/men-clothing?category=boxers' },
          { label: 'Plus Size Bottomwear', link: '/men-clothing?fit=plus-size' },
          { label: 'Cargos', link: '/men-clothing?category=cargo' },
          { label: 'Cargo Joggers', link: '/men-clothing?category=cargo-joggers' },
        ],
      },
      {
        title: 'Winterwear',
        items: [
          { label: 'All Winterwear', link: '/men-clothing?category=winterwear' },
          { label: 'Hoodies', link: '/men-clothing?category=hoodie' },
          { label: 'Sweatshirts', link: '/men-clothing?category=sweatshirt' },
          { label: 'Jackets', link: '/men-clothing?category=jacket' },
          { label: 'Sweaters', link: '/men-clothing?category=sweater' },
          { label: 'Windcheaters', link: '/men-clothing?category=windcheater' },
          { label: 'Co-ord Sets', link: '/men-clothing?category=coord' },
          { label: 'Sweatshirts & Hoodies', link: '/men-clothing?category=sweatshirt' },
          { label: 'Plus Size', link: '/men-clothing?fit=plus-size', isHeading: true },
        ],
      },
      {
        title: 'Innerwear & Loungewear',
        highlight: true,
        items: [
          { label: 'All Loungewear', link: '/men-clothing?category=loungewear' },
          { label: 'Vests', link: '/men-clothing?category=vest' },
          { label: 'Joggers', link: '/men-clothing?category=joggers' },
          { label: 'Trackpants', link: '/men-clothing?category=trackpants' },
          { label: 'Pajamas', link: '/men-clothing?category=pajamas' },
          { label: 'Shorts', link: '/men-clothing?category=shorts' },
          { label: 'Boxers', link: '/men-clothing?category=boxers' },
        ],
      },
    ],
    specials: [
      {
        title: 'Bewagofy SALE',
        subtitle: 'Shop Now',
        icon: '🏷️',
        link: '/men-clothing?sort=price_low',
      },
      {
        title: 'THE ACID WASH DRIP',
        subtitle: 'Acid Wash Drip',
        icon: '🎨',
        link: '/men-clothing?pattern=acid-wash',
      },
      {
        title: 'Buy 3 for 1199',
        subtitle: 'Offer Special',
        icon: '👕',
        link: '/men-clothing?offer=buy3',
      },
      {
        title: 'Buy 2 for 1199',
        subtitle: 'Combo Deal',
        icon: '🛍️',
        link: '/men-clothing?offer=buy2',
      },
    ],
  },
  women: {
    columns: [
      {
        title: 'Topwear',
        items: [
          { label: 'All Topwear', link: '/women-clothing' },
          { label: 'All T-Shirts', link: '/women-clothing?category=t-shirt' },
          { label: 'Oversized T-Shirts', link: '/women-clothing?fit=oversized' },
          { label: 'Boyfriend T-Shirts', link: '/women-clothing?fit=boyfriend' },
          { label: 'Crop Tops', link: '/women-clothing?category=crop-top' },
          { label: 'Printed T-Shirts', link: '/women-clothing?pattern=printed' },
          { label: 'Plain T-Shirts', link: '/women-clothing?pattern=solid' },
          { label: 'Shirts', link: '/women-clothing?category=shirt' },
          { label: 'Co-ord Sets', link: '/women-clothing?category=coord' },
          { label: 'Dresses', link: '/women-clothing?category=dresses' },
          { label: 'Kurtis', link: '/women-clothing?category=kurtis' },
        ],
      },
      {
        title: 'Bottomwear',
        highlight: true,
        items: [
          { label: 'All Bottomwear', link: '/women-clothing?category=bottomwear' },
          { label: 'Joggers', link: '/women-clothing?category=joggers' },
          { label: 'Pajamas', link: '/women-clothing?category=pajamas' },
          { label: 'Trousers & Pants', link: '/women-clothing?category=trousers' },
          { label: 'Jeans', link: '/women-clothing?category=jeans' },
          { label: 'Shorts', link: '/women-clothing?category=shorts' },
          { label: 'Boxers', link: '/women-clothing?category=boxers' },
          { label: 'Cargo Pants', link: '/women-clothing?category=cargo' },
          { label: 'Plus Size Bottomwear', link: '/women-clothing?fit=plus-size' },
        ],
      },
      {
        title: 'Winterwear',
        items: [
          { label: 'All Winterwear', link: '/women-clothing?category=winterwear' },
          { label: 'Hoodies', link: '/women-clothing?category=hoodie' },
          { label: 'Sweatshirts', link: '/women-clothing?category=sweatshirt' },
          { label: 'Jackets', link: '/women-clothing?category=jacket' },
          { label: 'Sweaters', link: '/women-clothing?category=sweater' },
          { label: 'Cardigans', link: '/women-clothing?category=cardigans' },
          { label: 'Plus Size Winterwear', link: '/women-clothing?fit=plus-size' },
        ],
      },
      {
        title: 'Loungewear & Sleepwear',
        highlight: true,
        items: [
          { label: 'All Loungewear', link: '/women-clothing?category=loungewear' },
          { label: 'Pajamas', link: '/women-clothing?category=pajamas' },
          { label: 'Shorts', link: '/women-clothing?category=shorts' },
          { label: 'Nightwear', link: '/women-clothing?category=nightwear' },
        ],
      },
    ],
    specials: [
      {
        title: 'Bewagofy SALE',
        subtitle: 'Shop Now',
        icon: '🏷️',
        link: '/women-clothing?sort=price_low',
      },
      {
        title: 'THE ACID WASH DRIP',
        subtitle: 'Acid Wash Drip',
        icon: '🎨',
        link: '/women-clothing?pattern=acid-wash',
      },
      {
        title: 'Buy 3 for 1199',
        subtitle: 'Offer Special',
        icon: '👗',
        link: '/women-clothing?offer=buy3',
      },
      {
        title: 'Buy 2 for 1199',
        subtitle: 'Combo Deal',
        icon: '🛍️',
        link: '/women-clothing?offer=buy2',
      },
    ],
  },
  accessories: {
    columns: [
      {
        title: 'Mobile Covers',
        items: [
          { label: 'All Mobile Covers', link: '/accessories?category=mobile-covers' },
          { label: 'iPhone Covers', link: '/accessories?brand=iphone' },
          { label: 'Samsung Covers', link: '/accessories?brand=samsung' },
          { label: 'OnePlus Covers', link: '/accessories?brand=oneplus' },
          { label: 'Realme Covers', link: '/accessories?brand=realme' },
          { label: 'Xiaomi Covers', link: '/accessories?brand=xiaomi' },
        ],
      },
      {
        title: 'Bags & Backpacks',
        highlight: true,
        items: [
          { label: 'All Bags', link: '/accessories?category=bags' },
          { label: 'Backpacks', link: '/accessories?category=backpacks' },
          { label: 'Duffle Bags', link: '/accessories?category=duffle' },
          { label: 'Laptop Bags', link: '/accessories?category=laptop-bags' },
          { label: 'Tote Bags', link: '/accessories?category=tote' },
        ],
      },
      {
        title: 'Footwear',
        items: [
          { label: 'All Footwear', link: '/accessories?category=footwear' },
          { label: 'Sliders', link: '/accessories?category=sliders' },
          { label: 'Sneakers', link: '/accessories?category=sneakers' },
          { label: 'Casual Shoes', link: '/accessories?category=casual-shoes' },
          { label: 'Socks', link: '/accessories?category=socks' },
        ],
      },
      {
        title: 'Fashion Accessories',
        highlight: true,
        items: [
          { label: 'Caps & Hats', link: '/accessories?category=caps' },
          { label: 'Sunglasses', link: '/accessories?category=sunglasses' },
          { label: 'Belts', link: '/accessories?category=belts' },
          { label: 'Wallets', link: '/accessories?category=wallets' },
          { label: 'Keychains', link: '/accessories?category=keychains' },
        ],
      },
    ],
    specials: [
      {
        title: 'Bewagofy SALE',
        subtitle: 'Shop Now',
        icon: '🏷️',
        link: '/accessories?sort=price_low',
      },
      {
        title: 'Buy 2 for 999',
        subtitle: 'Combo Offer',
        icon: '🎒',
        link: '/accessories?offer=buy2',
      },
    ],
  },
};

const Navbar = ({ gender, setGender }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredMegaMenu, setHoveredMegaMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const activeGender = location.pathname.includes('women')
    ? 'women'
    : location.pathname.includes('men')
    ? 'men'
    : location.pathname === '/'
    ? gender
    : null;

  const searchRef = useRef(null);
  const fuseRef = useRef(null);
  const megaMenuTimerRef = useRef(null);

  /* Load products for fuzzy search */
  useEffect(() => {
    axios.get(`${API}/products?limit=500`).then(({ data }) => {
      if (data?.products) {
        fuseRef.current = new Fuse(data.products, {
          keys: ['name', 'category', 'tags', 'collaboration', 'subCategory'],
          threshold: 0.35,
          minMatchCharLength: 2,
        });
      }
    }).catch(() => {});
  }, []);

  /* Close search dropdown on click outside */
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Search input handler */
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length >= 2 && fuseRef.current) {
      const results = fuseRef.current.search(val).slice(0, 7);
      setSuggestions(results.map((r) => r.item));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setMobileSearchOpen(false);
    }
  };

  const handleMegaMouseEnter = (menuKey) => {
    if (megaMenuTimerRef.current) clearTimeout(megaMenuTimerRef.current);
    setHoveredMegaMenu(menuKey);
  };

  const handleMegaMouseLeave = () => {
    megaMenuTimerRef.current = setTimeout(() => {
      setHoveredMegaMenu(null);
    }, 200);
  };

  return (
    <>
      {/* ── Top Announcement Bar (Centered with max-width: 1170px) ── */}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            <a href="#" className="topbar-link">Offers</a>
            <a href="#" className="topbar-link">Fanbook</a>
            <a href="#" className="topbar-link topbar-link-app">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17 2H7C5.9 2 5 2.9 5 4v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5-4H7V4h10v12z"/></svg>
              Download App
            </a>
            <a href="#" className="topbar-link">Find a store near me</a>
          </div>
          <div className="topbar-right">
            <a href="#" className="topbar-link">Contact Us</a>
            <a href="#" className="topbar-link">Track Order</a>
          </div>
        </div>
      </div>

      {/* ── Main Header (Centered with max-width: 1170px) ── */}
      <header className="navbar" onMouseLeave={handleMegaMouseLeave}>
        <div className="navbar-inner">

          {/* Hamburger Menu Icon (Mobile Only) */}
          <button
            className="navbar-hamburger"
            aria-label="Open Menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="12">
              <path d="M0 1H18M0 6H12M0 11H18" stroke="#333333" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Logo — Desktop trademark SVG, Mobile double-eyes SVG */}
          <Link to="/" className="navbar-logo" aria-label="Bewakoof Home" onClick={() => setGender(null)}>
            {/* Desktop Text Logo */}
            <img
              src="/bewakoof-logo.svg"
              alt="Bewakoof"
              className="bwkf-logo-img desktop-only"
            />
            {/* Mobile Eyes Logo */}
            <svg viewBox="0 0 80 40" className="mobile-only bwkf-eyes-logo" fill="currentColor">
              <circle cx="20" cy="24" r="11" />
              <circle cx="46" cy="24" r="11" />
              <path d="M 37 10 A 13 13 0 0 1 55 10" stroke="currentColor" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            </svg>
          </Link>

          <nav className="navbar-nav">
            <div
              className="nav-item-wrap"
              onMouseEnter={() => handleMegaMouseEnter('men')}
              onMouseLeave={handleMegaMouseLeave}
            >
              <Link
                to="/men-clothing"
                className={`nav-link ${(location.pathname === '/' && activeGender === 'men') || location.pathname === '/men-clothing' || hoveredMegaMenu === 'men' ? 'active' : ''}`}
                onMouseEnter={() => handleMegaMouseEnter('men')}
              >
                MEN
              </Link>
            </div>

            <div
              className="nav-item-wrap"
              onMouseEnter={() => handleMegaMouseEnter('women')}
              onMouseLeave={handleMegaMouseLeave}
            >
              <Link
                to="/women-clothing"
                className={`nav-link ${(location.pathname === '/' && activeGender === 'women') || location.pathname === '/women-clothing' || hoveredMegaMenu === 'women' ? 'active' : ''}`}
                onMouseEnter={() => handleMegaMouseEnter('women')}
              >
                WOMEN
              </Link>
            </div>

            <div
              className="nav-item-wrap"
              onMouseEnter={() => handleMegaMouseEnter('accessories')}
              onMouseLeave={handleMegaMouseLeave}
            >
              <Link
                to="/accessories"
                className={`nav-link ${location.pathname === '/accessories' || hoveredMegaMenu === 'accessories' ? 'active' : ''}`}
                onMouseEnter={() => handleMegaMouseEnter('accessories')}
              >
                ACCESSORIES
              </Link>
            </div>
          </nav>

          {/* Search Capsule (Desktop) */}
          <div className="navbar-search desktop-only" ref={searchRef}>
            <form onSubmit={submitSearch} className="search-form">
              <div className="search-input-wrap">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search by products"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  className="search-input"
                  id="navbar-search-input"
                />
              </div>
            </form>

            {/* Auto-complete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-dropdown">
                <p className="search-dropdown-label">Suggestions</p>
                {suggestions.map((p) => (
                  <button
                    key={p._id}
                    className="search-suggestion"
                    onClick={() => {
                      navigate(`/product/${p._id}`);
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                  >
                    <img src={p.images?.[0]} alt={p.name} className="suggestion-img" onError={(e) => { e.target.style.display='none'; }} />
                    <div className="suggestion-info">
                      <span className="suggestion-name">{p.name}</span>
                      <span className="suggestion-cat">{p.category} · ₹{p.price}</span>
                    </div>
                  </button>
                ))}
                <button
                  className="search-view-all"
                  onClick={() => { navigate(`/search?q=${encodeURIComponent(searchQuery)}`); setShowSuggestions(false); }}
                >
                  View all results for &ldquo;{searchQuery}&rdquo;
                </button>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="navbar-actions">
            <span className="nav-pipe desktop-only">|</span>

            {/* Search Icon (Mobile Only - toggles search bar overlay) */}
            <button
              className="nav-action-btn mobile-only"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-action-icon-svg">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <div className="nav-icon-wrap desktop-only" onMouseEnter={() => setUserMenuOpen(true)} onMouseLeave={() => setUserMenuOpen(false)}>
              <button className="nav-action-btn" id="user-menu-btn">
                <span className="nav-action-label">{isAuthenticated ? user?.name?.split(' ')[0] : 'LOGIN'}</span>
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  {isAuthenticated ? (
                    <>
                      <div className="user-dropdown-header">
                        <strong>{user?.name}</strong>
                        <span>{user?.email}</span>
                      </div>
                      <Link to="/profile" className="user-dropdown-item">👤 My Profile</Link>
                      <Link to="/orders" className="user-dropdown-item">📦 My Orders</Link>
                      <Link to="/wishlist" className="user-dropdown-item">❤️ Wishlist</Link>
                      <Link to="/profile" className="user-dropdown-item">📍 Saved Addresses</Link>
                      <div className="user-dropdown-divider" />
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="user-dropdown-item logout">🚪 Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="user-dropdown-item">Login</Link>
                      <Link to="/register" className="user-dropdown-item">Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link to="/wishlist" className="nav-action-btn" id="wishlist-nav-btn" aria-label="Wishlist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="nav-action-icon-svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlist.length > 0 && <span className="icon-badge">{wishlist.length}</span>}
            </Link>

            <Link to="/cart" className="nav-action-btn" id="cart-nav-btn" aria-label="Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="nav-action-icon-svg">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
            </Link>
          </div>

        </div>

        {/* Mobile Search Overlay Input */}
        {mobileSearchOpen && (
          <div className="mobile-search-bar" ref={searchRef}>
            <form onSubmit={submitSearch} className="search-form">
              <div className="search-input-wrap">
                <input
                  type="text"
                  placeholder="Search by products"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  className="search-input"
                  autoFocus
                />
                <button type="submit" className="mobile-search-submit">Search</button>
              </div>
            </form>
            {/* Auto-complete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-dropdown">
                {suggestions.map((p) => (
                  <button
                    key={p._id}
                    className="search-suggestion"
                    onClick={() => {
                      navigate(`/product/${p._id}`);
                      setSearchQuery('');
                      setShowSuggestions(false);
                      setMobileSearchOpen(false);
                    }}
                  >
                    <img src={p.images?.[0]} alt={p.name} className="suggestion-img" onError={(e) => { e.target.style.display='none'; }} />
                    <div className="suggestion-info">
                      <span className="suggestion-name">{p.name}</span>
                      <span className="suggestion-cat">{p.category} · ₹{p.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MEGA MENU DROPDOWN PANEL (Matches real bewakoof.com) ── */}
        {hoveredMegaMenu && MEGA_MENU_DATA[hoveredMegaMenu] && (
          <div
            className="megamenu-dropdown-overlay"
            onMouseEnter={() => handleMegaMouseEnter(hoveredMegaMenu)}
            onMouseLeave={handleMegaMouseLeave}
          >
            <div className="megamenu-container">
              {/* Columns */}
              {MEGA_MENU_DATA[hoveredMegaMenu].columns.map((col, idx) => (
                <div key={idx} className={`megamenu-column ${col.highlight ? 'column-highlight' : ''}`}>
                  <h4 className="megamenu-col-title">{col.title}</h4>
                  <ul className="megamenu-list">
                    {col.items.map((item, i) => (
                      <li key={i} className={item.isHeading ? 'megamenu-subheading' : ''}>
                        {item.isHeading ? (
                          <span className="subheading-text">{item.label}</span>
                        ) : (
                          <Link
                            to={item.link}
                            className="megamenu-item-link"
                            onClick={() => setHoveredMegaMenu(null)}
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* SPECIALS Column */}
              <div className="megamenu-column specials-column">
                <h4 className="megamenu-col-title">SPECIALS</h4>
                <div className="specials-grid">
                  {MEGA_MENU_DATA[hoveredMegaMenu].specials.map((spec, i) => (
                    <Link
                      key={i}
                      to={spec.link}
                      className="special-card"
                      onClick={() => setHoveredMegaMenu(null)}
                    >
                      <div className="special-icon-circle">{spec.icon}</div>
                      <div className="special-text-wrap">
                        <span className="special-title">{spec.title}</span>
                        <span className="special-subtitle">{spec.subtitle}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer (Left Slide-in Side Menu) */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="drawer-user-info">
                <div className="drawer-user-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="drawer-user-text">
                  <p className="drawer-user-title">Hey There!</p>
                  {isAuthenticated ? (
                    <p className="drawer-user-link">{user?.name}</p>
                  ) : (
                    <Link to="/login" className="drawer-user-link" onClick={() => setMobileMenuOpen(false)}>Login / Sign Up</Link>
                  )}
                </div>
              </div>
              <button className="drawer-close-btn" onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>

            <div className="drawer-content">
              <div className="drawer-section">
                <h5 className="drawer-section-title">SHOP IN</h5>
                <Link to="/men-clothing" className="drawer-link-item" onClick={() => { setGender('men'); setMobileMenuOpen(false); }}>
                  <span className="drawer-link-icon">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="18" cy="18" r="18" fill="#F3F3F5"/>
                      <circle cx="18" cy="15" r="5" stroke="#333" strokeWidth="1.5" fill="#FFF"/>
                      <path d="M14 13.5c.5-1.5 2-2 4-2s3.5.5 4 2" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="12.5" cy="15" r="1" fill="#333"/>
                      <circle cx="23.5" cy="15" r="1" fill="#333"/>
                      <path d="M11 27a7 7 0 0 1 14 0" stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                      <path d="M15 27c0-2.5 1.5-3.5 3-3.5s3 1 3 3.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    </svg>
                  </span>
                  <span className="drawer-link-label">Men</span>
                </Link>
                <Link to="/women-clothing" className="drawer-link-item" onClick={() => { setGender('women'); setMobileMenuOpen(false); }}>
                  <span className="drawer-link-icon">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="18" cy="18" r="18" fill="#F3F3F5"/>
                      <path d="M12 18c0-5 3-7 6-7s6 2 6 7v4" stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="#333"/>
                      <circle cx="18" cy="15" r="5" stroke="#333" strokeWidth="1.5" fill="#FFF"/>
                      <path d="M11 27a7 7 0 0 1 14 0" stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                      <path d="M16 27l2-2 2 2" stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    </svg>
                  </span>
                  <span className="drawer-link-label">Women</span>
                </Link>
                <Link to="/accessories" className="drawer-link-item" onClick={() => { setGender('unisex'); setMobileMenuOpen(false); }}>
                  <span className="drawer-link-icon">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="18" cy="18" r="18" fill="#F3F3F5"/>
                      <rect x="18" y="10" width="8" height="15" rx="1.5" transform="rotate(15 22 17.5)" fill="#FFF" stroke="#333" strokeWidth="1.5"/>
                      <rect x="11" y="11" width="8" height="15" rx="1.5" fill="#FFF" stroke="#333" strokeWidth="1.5"/>
                      <rect x="13" y="13" width="2" height="3" rx="0.5" fill="#333"/>
                    </svg>
                  </span>
                  <span className="drawer-link-label">Mobile Covers & Accessories</span>
                </Link>
              </div>

              <div className="drawer-section">
                <h5 className="drawer-section-title">MY PROFILE</h5>
                <div className="drawer-profile-grid">
                  <Link to="/profile" className="drawer-grid-card" onClick={() => setMobileMenuOpen(false)}>
                    <span className="drawer-grid-icon">
                      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="50" height="50" rx="8" fill="#F4F4F6"/>
                        <circle cx="25" cy="18" r="5" stroke="#333" strokeWidth="1.5" fill="#FDD835"/>
                        <path d="M15 36c0-6 4.5-10 10-10s10 4 10 10" stroke="#333" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                      </svg>
                    </span>
                    <span className="drawer-grid-label">My Account</span>
                  </Link>
                  <Link to="/orders" className="drawer-grid-card" onClick={() => setMobileMenuOpen(false)}>
                    <span className="drawer-grid-icon">
                      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="50" height="50" rx="8" fill="#F4F4F6"/>
                        <path d="M10 20h4M8 24h6M9 28h5" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M16 18h16v12H16V18Z" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#FFF"/>
                        <path d="M17 19h14v10H17V19Z" fill="#FDD835"/>
                        <path d="M32 21h8l4 4v5H32V21Z" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#FFF"/>
                        <path d="M37 21v4h5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="21" cy="34" r="3" stroke="#333" strokeWidth="1.5" fill="#FFF"/>
                        <circle cx="37" cy="34" r="3" stroke="#333" strokeWidth="1.5" fill="#FFF"/>
                      </svg>
                    </span>
                    <span className="drawer-grid-label">My Orders</span>
                  </Link>
                  <Link to="/profile" className="drawer-grid-card" onClick={() => setMobileMenuOpen(false)}>
                    <span className="drawer-grid-icon">
                      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="50" height="50" rx="8" fill="#F4F4F6"/>
                        <rect x="14" y="18" width="22" height="15" rx="1.5" fill="#FDD835" stroke="#333" strokeWidth="1.5"/>
                        <path d="M28 21h8v8h-8z" fill="#FFF" stroke="#333" strokeWidth="1.5"/>
                        <circle cx="32" cy="25" r="1" fill="#333"/>
                      </svg>
                    </span>
                    <span className="drawer-grid-label">My Wallet</span>
                  </Link>
                  <Link to="/wishlist" className="drawer-grid-card" onClick={() => setMobileMenuOpen(false)}>
                    <span className="drawer-grid-icon">
                      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="50" height="50" rx="8" fill="#F4F4F6"/>
                        <path d="M25 35.5s-10-6.5-10-13c0-3.3 2.8-6 6-6 2.5 0 3.7 1.6 4 2 .3-.4 1.5-2 4-2 3.2 0 6 2.7 6 6 0 6.5-10 13-10 13Z" fill="#FDD835" stroke="#333" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="drawer-grid-label">My Wishlist</span>
                  </Link>
                </div>
              </div>

              <div className="drawer-section">
                <h5 className="drawer-section-title">CONTACT US</h5>
                <a href="#" className="drawer-link-item plain" onClick={() => setMobileMenuOpen(false)}>Help & Support</a>
                <a href="#" className="drawer-link-item plain" onClick={() => setMobileMenuOpen(false)}>Feedback & Suggestions</a>
              </div>

              <div className="drawer-section">
                <h5 className="drawer-section-title">ABOUT US</h5>
                <a href="#" className="drawer-link-item plain" onClick={() => setMobileMenuOpen(false)}>Our Story</a>
                <a href="#" className="drawer-link-item plain" onClick={() => setMobileMenuOpen(false)}>Fanbook</a>
              </div>

              {isAuthenticated && (
                <button className="drawer-logout-btn" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Sub-Nav (unified switcher capsule and scrollable links) ── */}
      {(location.pathname !== '/' || gender || activeGender) && (
        <div className="subnav">
          <div className="subnav-inner">
            {/* Inline Switcher Capsule */}
            <div className="subnav-gender-switcher">
              <button
                className={`subnav-gender-btn ${activeGender === 'men' ? 'active' : ''}`}
                onClick={() => {
                  setGender('men');
                  if (location.pathname !== '/') navigate('/men-clothing');
                }}
              >
                MEN
              </button>
              <button
                className={`subnav-gender-btn ${activeGender === 'women' ? 'active' : ''}`}
                onClick={() => {
                  setGender('women');
                  if (location.pathname !== '/') navigate('/women-clothing');
                }}
              >
                WOMEN
              </button>
            </div>

            {/* Scrollable links (Desktop/Tablet only) */}
            <div className="subnav-links-wrap">
              {SUB_NAV.map((item) => (
                <Link
                  key={item.label}
                  to={item.link}
                  className="subnav-link"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
