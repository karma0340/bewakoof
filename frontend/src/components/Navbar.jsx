import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import axios from 'axios';
import './Navbar.css';

const API = '/api';

/* Sub-nav items — matches real bewakoof.com */
const SUB_NAV = [
  { label: 'MEN', link: '/men-clothing', gender: 'men' },
  { label: 'WOMEN', link: '/women-clothing', gender: 'women' },
  { label: 'LIVE NOW', link: '/men-clothing?sort=newest' },
  { label: 'ACCESSORIES', link: '/accessories' },
  { label: 'PLUS SIZE', link: '/men-clothing?fit=plus-size' },
  { label: 'PARTY ANIMAL', link: '/men-clothing?pattern=graphic' },
  { label: 'SNEAKERS', link: '/accessories?category=sneakers' },
  { label: 'OFFICE WEAR', link: '/men-clothing?category=shirt' },
  { label: 'POLOS', link: '/men-clothing?category=polo' },
  { label: 'JOGGERS', link: '/men-clothing?category=joggers' },
  { label: 'HOODIES', link: '/men-clothing?category=hoodie' },
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
        subtitle: 'Accessory Combo',
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

          {/* Logo — Real Bewakoof trademark SVG */}
          <Link to="/" className="navbar-logo" aria-label="Bewakoof Home">
            <img
              src="/bewakoof-logo.svg"
              alt="Bewakoof"
              className="bwkf-logo-img"
            />
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
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    setGender('men');
                  }
                }}
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
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    setGender('women');
                  }
                }}
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

          {/* Search Capsule */}
          <div className="navbar-search" ref={searchRef}>
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

          {/* Right Actions: | LOGIN ♡ 🛍 */}
          <div className="navbar-actions">
            <span className="nav-pipe">|</span>

            <div className="nav-icon-wrap" onMouseEnter={() => setUserMenuOpen(true)} onMouseLeave={() => setUserMenuOpen(false)}>
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
                      <Link to="/orders" className="user-dropdown-item">My Orders</Link>
                      <Link to="/wishlist" className="user-dropdown-item">Wishlist</Link>
                      <button onClick={logout} className="user-dropdown-item logout">Logout</button>
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="nav-action-icon-svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlist.length > 0 && <span className="icon-badge">{wishlist.length}</span>}
            </Link>

            <Link to="/cart" className="nav-action-btn" id="cart-nav-btn" aria-label="Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="nav-action-icon-svg">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
            </Link>
          </div>

        </div>

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

      {/* ── Sub-Nav (scrollable pill bar) — Shown on shop pages or when gender is active ── */}
      {(location.pathname !== '/' || gender) && (
        <div className="subnav">
          <div className="subnav-inner">
            {SUB_NAV.map((item) => (
              <Link
                key={item.label}
                to={item.link}
                onClick={(e) => {
                  if (item.gender && location.pathname === '/') {
                    e.preventDefault();
                    setGender(item.gender);
                  }
                }}
                className={`subnav-link ${item.gender === activeGender ? 'subnav-pill-active' : item.gender ? 'subnav-pill-inactive' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
