import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const TICKER_ITEMS = [
  {
    id: 1,
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="#2d2d2d" className="ticker-icon">
        <path d="M19 6h-3c0-2.21-1.79-4-4-4S8 3.79 8 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm7 16H5V8h3v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h3v12z"/>
      </svg>
    ),
    boldText: '2 Crores+',
    normalText: 'Customers Bought',
  },
  {
    id: 2,
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="#2d2d2d" className="ticker-icon">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 10H9v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z"/>
      </svg>
    ),
    boldText: '10 Crores+',
    normalText: 'Products Sold',
  },
];

const HomePage = () => {
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const currentTicker = TICKER_ITEMS[tickerIndex];

  return (
    <div className="landing-page-wrapper">
      {/* Top Animated Ticker Bar (matches real bewakoof.com continuous flow) */}
      <div className="landing-ticker-bar">
        <div className="landing-ticker-content" key={currentTicker.id}>
          {currentTicker.icon}
          <span>
            <strong>{currentTicker.boldText}</strong> {currentTicker.normalText}
          </span>
        </div>
      </div>

      {/* Hero Yellow Banner Section */}
      <section className="landing-hero-section">
        {/* Aditya Birla Logo on top-right */}
        <div className="landing-abfrl-logo">
          <img src="/abfrl-logo.svg" alt="Aditya Birla Fashion & Retail" />
        </div>

        <div className="landing-hero-content">
          {/* Header Title graphic */}
          <div className="landing-hero-title">
            <img src="/shop-for.svg" alt="bewakoof SHOP FOR" className="shop-for-img" />
          </div>

          {/* Men and Women cards */}
          <div className="landing-gender-container">
            <Link to="/men-clothing" className="landing-gender-card" id="landing-men-card">
              <img src="/gender-men.png" alt="Men Fashion" className="landing-card-photo" />
              <div className="landing-card-btn">MEN</div>
            </Link>
            <Link to="/women-clothing" className="landing-gender-card" id="landing-women-card">
              <img src="/gender-women.png" alt="Women Fashion" className="landing-card-photo" />
              <div className="landing-card-btn">WOMEN</div>
            </Link>
          </div>
        </div>

        {/* Official Collab Characters Banner */}
        <div className="landing-collab-banner">
          <img src="/official-collab.webp" alt="Official Collaborations" className="collab-img" />
        </div>
      </section>

      {/* Bottom White Slogan Footer Bar */}
      <footer className="landing-bottom-bar">
        <img src="/bk-slogan.svg" alt="ALL EYES ON YOU - Homegrown & Proud Since 2012" className="slogan-img" />
      </footer>
    </div>
  );
};

export default HomePage;
