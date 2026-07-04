import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const baseUrl = import.meta.env.VITE_API_URL || '';
const API = baseUrl ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/api`) : '/api';

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

// Banner carousels for Men and Women (using original CDN paths)
const HERO_BANNERS = {
  men: [
    'https://images.bewakoof.com/uploads/grid/app/1X1-BewagoofySale-July2026-MEN_1783078719102.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-oversized-men_1783091958439.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-jeans-men_1783091958439.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-cft-men_1783091958439.jpg',
  ],
  women: [
    'https://images.bewakoof.com/uploads/grid/app/1X1-BewagoofySale-July2026-WOMEN_1783078719102.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-oversized-women_1783091958439.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-jeans-women_1783091958439.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-cft-women_1783091958439.jpg',
  ],
};

const MEN_TRENDING_CATEGORIES = [
  { label: 'T-Shirts', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-tshirts-men-1777959959.jpg', link: '/men-clothing?category=t-shirt' },
  { label: 'Joggers', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-joggers-men-1777959962.jpg', link: '/men-clothing?category=joggers' },
  { label: 'Polos', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-polo-men--1--1777959960.jpg', link: '/men-clothing?category=polo' },
  { label: 'Sneakers', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-sneaker-men--1--1777959959.jpg', link: '/accessories?category=sneakers' },
  { label: 'Accessories', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-accessories-men-1777959963.jpg', link: '/accessories' },
  { label: 'Winterwear', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-winter-men-1777959961.jpg', link: '/men-clothing?category=winterwear' },
  { label: 'Shirts', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-shirt-men-1777959960.jpg', link: '/men-clothing?category=shirt' },
  { label: 'Jeans', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-jeans-men--1--1777959963.jpg', link: '/men-clothing?category=jeans' },
  { label: 'Summer Sets', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-summer-men-1777959961.jpg', link: '/men-clothing?pattern=printed' },
  { label: 'Pants', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-pants-men-1777959962.jpg', link: '/men-clothing?category=trousers' },
  { label: 'Plus Size', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-plus-men--1--1777959961.jpg', link: '/men-clothing?fit=plus-size' },
  { label: 'View All', src: 'https://images.bewakoof.com/uploads/grid/app/444x666-Trending-Category-Icon--3--1737370241.jpg', link: '/men-clothing' }
];

const WOMEN_TRENDING_CATEGORIES = [
  { label: 'T-Shirts', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-tshirts-women-1777959972.jpg', link: '/women-clothing?category=t-shirt' },
  { label: 'Joggers', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-joggers-women-1777959974.jpg', link: '/women-clothing?category=joggers' },
  { label: 'Polos', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-polo-women-1777959972.jpg', link: '/women-clothing?category=polo' },
  { label: 'Sneakers', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-sneakers-women-1777959976.jpg', link: '/accessories?category=sneakers' },
  { label: 'Accessories', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-accessories-women-1777959976.jpg', link: '/accessories' },
  { label: 'Winterwear', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-winter-women-1777959973.jpg', link: '/women-clothing?category=winterwear' },
  { label: 'Shirts', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-shirt-women-1777959973.jpg', link: '/women-clothing?category=shirt' },
  { label: 'Jeans', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-jeans-women-1777959975.jpg', link: '/women-clothing?category=jeans' },
  { label: 'Dresses', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-dresses-women-1777959975.jpg', link: '/women-clothing?category=dresses' },
  { label: 'Pants', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-pants-women-1777959974.jpg', link: '/women-clothing?category=trousers' },
  { label: 'Plus Size', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-plus-women-1777959973.jpg', link: '/women-clothing?fit=plus-size' },
  { label: 'View All', src: 'https://images.bewakoof.com/uploads/grid/app/444x666-Trending-Category-Icon--3--1737370241.jpg', link: '/women-clothing' }
];

const OVERSIZED_HAUL_WIDGETS = [
  { label: 'Graphic Prints', src: 'https://images.bewakoof.com/uploads/grid/app/Desktop-T-shirt-Widgets-360x400-1--1772133772.jpg', query: 'graphic' },
  { label: 'Minimalist', src: 'https://images.bewakoof.com/uploads/grid/app/Desktop-T-shirt-Widgets-360x400-2--1772133772.jpg', query: 'minimal' },
  { label: 'Acid Wash', src: 'https://images.bewakoof.com/uploads/grid/app/Desktop-T-shirt-Widgets-360x400-5--1772133771.jpg', query: 'acid-wash' },
  { label: 'Typography', src: 'https://images.bewakoof.com/uploads/grid/app/Desktop-T-shirt-Widgets-360x400-4--1772133771.jpg', query: 'typography' },
  { label: 'Solids', src: 'https://images.bewakoof.com/uploads/grid/app/Desktop-T-shirt-Widgets-360x400-3--1772133771.jpg', query: 'solid' },
  { label: 'All Styles', src: 'https://images.bewakoof.com/uploads/grid/app/Desktop-T-shirt-Widgets-360x400-6--1772133770.jpg', query: 'all' },
];

const HomePage = ({ gender, setGender }) => {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [bestsellers, setBestsellers] = useState([]);
  const [loadingBestsellers, setLoadingBestsellers] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Fetch bestsellers from database on gender tab switch
  useEffect(() => {
    if (gender) {
      setLoadingBestsellers(true);
      // Fetch products matching gender
      axios.get(`${API}/products?gender=${gender}&limit=12`)
        .then(({ data }) => {
          if (data && data.products) {
            setBestsellers(data.products);
          }
          setLoadingBestsellers(false);
        })
        .catch(() => {
          setLoadingBestsellers(false);
        });
    }
  }, [gender]);

  const activeBanners = gender ? HERO_BANNERS[gender] || HERO_BANNERS.men : [];
  const activeCategories = gender === 'women' ? WOMEN_TRENDING_CATEGORIES : MEN_TRENDING_CATEGORIES;

  // Auto-slide hero banners with seamless infinite loop
  useEffect(() => {
    if (!gender) return;
    setSlideIndex(0); // Reset on gender swap
    setTransitionEnabled(true);
    
    const slideTimer = setInterval(() => {
      setTransitionEnabled(true);
      setSlideIndex((prev) => prev + 1);
    }, 3800);
    return () => clearInterval(slideTimer);
  }, [gender]);

  // Snap-back logic for infinite loop
  useEffect(() => {
    if (slideIndex === activeBanners.length) {
      // Wait for the slide transition (0.5s) to complete, then snap back
      const resetTimer = setTimeout(() => {
        setTransitionEnabled(false);
        setSlideIndex(0);
      }, 500); 
      return () => clearTimeout(resetTimer);
    }
  }, [slideIndex, activeBanners.length]);

  const currentTicker = TICKER_ITEMS[tickerIndex];

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  // If no gender active, render initial selection screen
  if (!gender) {
    return (
      <div className="landing-page-wrapper">
        <div className="landing-ticker-bar">
          <div className="landing-ticker-content" key={currentTicker.id}>
            {currentTicker.icon}
            <span>
              <strong>{currentTicker.boldText}</strong> {currentTicker.normalText}
            </span>
          </div>
        </div>

        <section className="landing-hero-section">
          <div className="landing-abfrl-logo">
            <img src="/abfrl-logo.svg" alt="Aditya Birla Fashion & Retail" />
          </div>

          <div className="landing-hero-content">
            <div className="landing-hero-title">
              <img src="/shop-for.svg" alt="bewakoof SHOP FOR" className="shop-for-img" />
            </div>

            <div className="landing-gender-container">
              <button onClick={() => setGender('men')} className="landing-gender-card" id="landing-men-card">
                <img src="/gender-men.png" alt="Men Fashion" className="landing-card-photo" />
                <div className="landing-card-btn">MEN</div>
              </button>
              <button onClick={() => setGender('women')} className="landing-gender-card" id="landing-women-card">
                <img src="/gender-women.png" alt="Women Fashion" className="landing-card-photo" />
                <div className="landing-card-btn">WOMEN</div>
              </button>
            </div>
          </div>

          <div className="landing-collab-banner">
            <img src="/official-collab.webp" alt="Official Collaborations" className="collab-img" />
          </div>
        </section>

        <footer className="landing-bottom-bar">
          <img src="/bk-slogan.svg" alt="ALL EYES ON YOU - Homegrown & Proud Since 2012" className="slogan-img" />
        </footer>
      </div>
    );
  }

  // Else, render the rich homepage shop landing
  return (
    <div className="shop-home-wrapper">
      {/* 1. Hero Auto-sliding Banner Slider */}
      <section className="shop-slider-container">
        <div 
          className={`shop-slider-track ${transitionEnabled ? 'has-transition' : ''}`} 
          style={{ '--slide-index': slideIndex }}
        >
          {/* Render the banners twice for seamless infinite loop */}
          {[...activeBanners, ...activeBanners].map((banner, index) => (
            <div className="shop-slide" key={index}>
              <img src={banner} alt={`Banner ${index}`} className="slide-image" />
            </div>
          ))}
        </div>
        <div className="slider-dots">
          {activeBanners.map((_, index) => (
            <span
              key={index}
              className={`slider-dot ${index === (slideIndex % activeBanners.length) ? 'active' : ''}`}
              onClick={() => {
                setTransitionEnabled(true);
                setSlideIndex(index);
              }}
            />
          ))}
        </div>
      </section>

      {/* 2. Static Cashback Coupon Bar */}
      <div className="shop-promo-strip">
        <img
          src="https://images.bewakoof.com/uploads/grid/app/thinstrip-coupon-offer-desktop__3__1782386032867.jpg"
          alt="10% Cashback"
          className="promo-strip-img"
        />
      </div>

      {/* 3. Trending Categories Section */}
      <section className="trending-categories-section">
        <h2 className="section-main-title">Trending Categories</h2>
        <div className="categories-grid-container">
          {activeCategories.map((cat, idx) => (
            <Link to={cat.link} className="category-circle-card" key={idx}>
              <div className="circle-image-wrap">
                <img src={cat.src} alt={cat.label} className="circle-img" />
              </div>
              <span className="circle-card-label">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Dynamic Bestsellers Sliding Section */}
      <section className="bestsellers-section">
        <h2 className="section-main-title">Bestsellers</h2>
        
        {loadingBestsellers ? (
          <div className="bestsellers-skeleton">
            <p>Loading premium bestsellers...</p>
          </div>
        ) : (
          <div className="bestsellers-carousel-wrapper">
            <button className="carousel-arrow arrow-left" onClick={() => handleScroll('left')} aria-label="Slide Left">‹</button>
            <div className="bestsellers-scroll-container" ref={scrollRef}>
              {bestsellers.map((product) => (
                <div className="bestseller-card-wrap" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <button className="carousel-arrow arrow-right" onClick={() => handleScroll('right')} aria-label="Slide Right">›</button>
          </div>
        )}
        
        <div className="explore-all-btn-wrap">
          <Link to={gender === 'women' ? '/women-clothing' : '/men-clothing'} className="explore-all-link">
            Explore All
          </Link>
        </div>
      </section>

      {/* 5. Oversized Tees Haul / Print-patterns Section */}
      <section className="oversized-tees-haul-section">
        <div className="haul-title-wrap">
          <img
            src="https://images.bewakoof.com/uploads/grid/app/Desktop-header-720x100-1772133773.jpg"
            alt="Oversized Tees Haul"
            className="haul-title-img"
          />
        </div>
        <div className="haul-grid-container">
          {OVERSIZED_HAUL_WIDGETS.map((widget, idx) => (
            <Link
              to={gender === 'women' ? `/women-clothing?pattern=${widget.query !== 'all' ? widget.query : ''}` : `/men-clothing?pattern=${widget.query !== 'all' ? widget.query : ''}`}
              className="haul-grid-card"
              key={idx}
            >
              <img src={widget.src} alt={widget.label} className="haul-img" />
              <div className="haul-card-overlay">
                <span>{widget.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
