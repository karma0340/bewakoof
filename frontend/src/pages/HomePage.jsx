import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
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

// Banner carousels for Men and Women (using live CDN paths)
const HERO_BANNERS = {
  men: [
    'https://images.bewakoof.com/uploads/grid/app/1x1-BewagoofySale-July2026-endstod-men_1783280286566.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-oversized-men_1783091958439.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-jeans-men_1783091958439.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-cft-men_1783091958439.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-joggers-men_1783091958439.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-shirts-men_1783091958439.jpg',
  ],
  women: [
    'https://images.bewakoof.com/uploads/grid/app/1x1-BewagoofySale-July2026-endstod-women_1783280286567.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-oversized-women_1783092413426.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-jeans-women_1783092413426.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-bf-women_1783092413426.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-joggers-women_1783092413426.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1x1-goofysale-July2026-shirts-women_1783092413425.jpg',
  ],
};

const NEWEST_DROPS_BANNERS = {
  men: [
    'https://images.bewakoof.com/uploads/grid/app/Capsule_banner_desktop-ollie_1782809645183.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1440x400-desktop-CapsuleBanner-shortsseason-men_1781601574241.jpg',
    'https://images.bewakoof.com/uploads/grid/app/desktop-accesories_1782281146022.jpg',
    'https://images.bewakoof.com/uploads/grid/app/1440x400-Msite-CapsuleBanner-01_1779682448720.jpg',
    'https://images.bewakoof.com/uploads/grid/app/Capsule_desktop_men_1779448126755.png',
  ],
  women: [
    'https://images.bewakoof.com/uploads/grid/app/Capsule_banner_desktop-ollie_1782809645183.jpg',
    'https://images.bewakoof.com/uploads/grid/app/desktop-accesories_1782281146022.jpg',
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
  { label: 'T-Shirts', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-tees-women-1778563821.jpg', link: '/women-clothing?category=t-shirt' },
  { label: 'Joggers', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-joggers-women-1777958663.jpg', link: '/women-clothing?category=joggers' },
  { label: 'Jeans', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-jeans-women-1777958662.jpg', link: '/women-clothing?category=jeans' },
  { label: 'Dresses', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-dresses-women-1778564065.jpg', link: '/women-clothing?category=dresses' },
  { label: 'Accessories', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-accessories-women-1777958661.jpg', link: '/accessories' },
  { label: 'Winterwear', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-winterr-women-1778564064.jpg', link: '/women-clothing?category=winterwear' },
  { label: 'Shirts', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-shirts-women-1778564064.jpg', link: '/women-clothing?category=shirt' },
  { label: 'Summer Sets', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-summer-women-1777958661.jpg', link: '/women-clothing?pattern=printed' },
  { label: 'Pants', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-pants-women-1777958662.jpg', link: '/women-clothing?category=trousers' },
  { label: 'Plus Size', src: 'https://images.bewakoof.com/uploads/grid/app/DESKTOP-444x666-TrendingCategoryIcon-2026-plus-women-1777959067.jpg', link: '/women-clothing?fit=plus-size' },
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
  const [newestSlideIndex, setNewestSlideIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [bestsellers, setBestsellers] = useState([]);
  const [trackpants, setTrackpants] = useState([]);
  const [jeans, setJeans] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [summerPicks, setSummerPicks] = useState([]);

  const [loadingBestsellers, setLoadingBestsellers] = useState(false);
  const [loadingTrackpants, setLoadingTrackpants] = useState(false);
  const [loadingJeans, setLoadingJeans] = useState(false);
  const [loadingNewArrivals, setLoadingNewArrivals] = useState(false);
  const [loadingSummerPicks, setLoadingSummerPicks] = useState(false);

  const scrollRef = useRef(null);
  const trackpantsScrollRef = useRef(null);
  const jeansScrollRef = useRef(null);
  const newArrivalsScrollRef = useRef(null);
  const summerPicksScrollRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Fetch all product shelves on gender tab switch
  useEffect(() => {
    if (gender) {
      setLoadingBestsellers(true);
      setLoadingTrackpants(true);
      setLoadingJeans(true);
      setLoadingNewArrivals(true);
      setLoadingSummerPicks(true);

      // 1. Bestsellers (all/popular products)
      axios.get(`${API}/products?gender=${gender}&limit=12`)
        .then(({ data }) => {
          if (data && data.products) setBestsellers(data.products);
          setLoadingBestsellers(false);
        })
        .catch(() => setLoadingBestsellers(false));

      // 2. Trackpants (category trackpants/joggers/pants)
      axios.get(`${API}/products?gender=${gender}&category=trackpants,pants,joggers&limit=12`)
        .then(({ data }) => {
          if (data && data.products) setTrackpants(data.products);
          setLoadingTrackpants(false);
        })
        .catch(() => setLoadingTrackpants(false));

      // 3. Jeans
      axios.get(`${API}/products?gender=${gender}&category=jeans&limit=12`)
        .then(({ data }) => {
          if (data && data.products) setJeans(data.products);
          setLoadingJeans(false);
        })
        .catch(() => setLoadingJeans(false));

      // 4. New Arrivals
      axios.get(`${API}/products?gender=${gender}&sort=newest&limit=12`)
        .then(({ data }) => {
          if (data && data.products) setNewArrivals(data.products);
          setLoadingNewArrivals(false);
        })
        .catch(() => setLoadingNewArrivals(false));

      // 5. Hot Summer Picks (vests, boxers, pyjamas, shorts)
      axios.get(`${API}/products?gender=${gender}&category=vest,boxers,pyjamas,shorts&limit=12`)
        .then(({ data }) => {
          if (data && data.products) setSummerPicks(data.products);
          setLoadingSummerPicks(false);
        })
        .catch(() => setLoadingSummerPicks(false));
    }
  }, [gender]);

  const activeBanners = gender ? HERO_BANNERS[gender] || HERO_BANNERS.men : [];
  const activeNewestBanners = gender ? NEWEST_DROPS_BANNERS[gender] || NEWEST_DROPS_BANNERS.men : [];
  const activeCategories = gender === 'women' ? WOMEN_TRENDING_CATEGORIES : MEN_TRENDING_CATEGORIES;

  // Auto-slide hero banners with seamless infinite loop
  useEffect(() => {
    if (!gender) return;
    setSlideIndex(0); // Reset on gender swap
    setNewestSlideIndex(0);
    setTransitionEnabled(true);
    
    const slideTimer = setInterval(() => {
      setTransitionEnabled(true);
      setSlideIndex((prev) => prev + 1);
    }, 3800);

    const newestTimer = setInterval(() => {
      setNewestSlideIndex((prev) => (prev + 1) % activeNewestBanners.length);
    }, 5000);

    return () => {
      clearInterval(slideTimer);
      clearInterval(newestTimer);
    };
  }, [gender, activeNewestBanners.length]);

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

  const handleScroll = (ref, direction) => {
    const targetRef = ref || scrollRef;
    if (targetRef.current) {
      const { scrollLeft, clientWidth } = targetRef.current;
      const offset = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      targetRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
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

      {/* Newest Drops of the Season Sliding Banners */}
      <section className="newest-drops-section">
        <h2 className="section-main-title">NEWEST DROPS OF THE SEASON</h2>
        <div className="newest-drops-slider-container">
          <div 
            className="newest-drops-slider-track"
            style={{ transform: `translateX(-${newestSlideIndex * 100}%)` }}
          >
            {activeNewestBanners.map((banner, index) => (
              <div className="newest-slide" key={index}>
                <img src={banner} alt={`Newest Drop ${index}`} className="newest-slide-image" />
              </div>
            ))}
          </div>
          <div className="slider-dots">
            {activeNewestBanners.map((_, index) => (
              <span
                key={index}
                className={`slider-dot ${index === newestSlideIndex ? 'active' : ''}`}
                onClick={() => setNewestSlideIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Oversized Tees Haul / Print-patterns Section */}
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

      {/* 4. Trending Categories Section */}
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

      {/* 5. Trackpants Section */}
      <section className="bestsellers-section">
        <h2 className="section-main-title">Trackpants</h2>
        {loadingTrackpants ? (
          <Loader />
        ) : (
          <div className="bestsellers-carousel-wrapper">
            <button className="carousel-arrow arrow-left" onClick={() => handleScroll(trackpantsScrollRef, 'left')} aria-label="Slide Left">‹</button>
            <div className="bestsellers-scroll-container" ref={trackpantsScrollRef}>
              {(trackpants.length > 0 ? trackpants : bestsellers).slice(0, 12).map((product) => (
                <div className="bestseller-card-wrap" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <button className="carousel-arrow arrow-right" onClick={() => handleScroll(trackpantsScrollRef, 'right')} aria-label="Slide Right">›</button>
          </div>
        )}
        <div className="explore-all-btn-wrap">
          <Link to={gender === 'women' ? '/women-clothing?category=trackpants,pants,joggers' : '/men-clothing?category=trackpants,pants,joggers'} className="explore-all-link">
            Explore All
          </Link>
        </div>
      </section>

      {/* 6. Denim Verse Section */}
      <section className="bestsellers-section">
        <h2 className="section-main-title">Denim Verse</h2>
        {loadingJeans ? (
          <Loader />
        ) : (
          <div className="bestsellers-carousel-wrapper">
            <button className="carousel-arrow arrow-left" onClick={() => handleScroll(jeansScrollRef, 'left')} aria-label="Slide Left">‹</button>
            <div className="bestsellers-scroll-container" ref={jeansScrollRef}>
              {(jeans.length > 0 ? jeans : bestsellers).slice(0, 12).map((product) => (
                <div className="bestseller-card-wrap" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <button className="carousel-arrow arrow-right" onClick={() => handleScroll(jeansScrollRef, 'right')} aria-label="Slide Right">›</button>
          </div>
        )}
        <div className="explore-all-btn-wrap">
          <Link to={gender === 'women' ? '/women-clothing?category=jeans' : '/men-clothing?category=jeans'} className="explore-all-link">
            Explore All
          </Link>
        </div>
      </section>

      {/* 7. New Arrivals Section */}
      <section className="bestsellers-section">
        <h2 className="section-main-title">New Arrivals</h2>
        {loadingNewArrivals ? (
          <Loader />
        ) : (
          <div className="bestsellers-carousel-wrapper">
            <button className="carousel-arrow arrow-left" onClick={() => handleScroll(newArrivalsScrollRef, 'left')} aria-label="Slide Left">‹</button>
            <div className="bestsellers-scroll-container" ref={newArrivalsScrollRef}>
              {(newArrivals.length > 0 ? newArrivals : bestsellers).slice(0, 12).map((product) => (
                <div className="bestseller-card-wrap" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <button className="carousel-arrow arrow-right" onClick={() => handleScroll(newArrivalsScrollRef, 'right')} aria-label="Slide Right">›</button>
          </div>
        )}
        <div className="explore-all-btn-wrap">
          <Link to={gender === 'women' ? '/women-clothing?sort=newest' : '/men-clothing?sort=newest'} className="explore-all-link">
            Explore All
          </Link>
        </div>
      </section>

      {/* 8. Savings Corner Section */}
      <section className="savings-corner-section">
        <h2 className="section-main-title">Savings Corner</h2>
        <div className="savings-corner-grid">
          <Link to={gender === 'women' ? '/women-clothing?fit=oversized' : '/men-clothing?fit=oversized'} className="savings-card yellow-card">
            <span className="savings-title">Buy 2 {gender === 'women' ? "Women's" : "Men's"} Oversized T-Shirts at ₹1199</span>
            <span className="savings-action">Shop Now ›</span>
          </Link>
          <Link to={gender === 'women' ? '/women-clothing?fit=regular' : '/men-clothing?fit=regular'} className="savings-card dark-card">
            <span className="savings-title">Buy 3 Classic Fit T-Shirts at ₹1199</span>
            <span className="savings-action">Shop Now ›</span>
          </Link>
          <Link to={gender === 'women' ? '/women-clothing?maxPrice=599' : '/men-clothing?maxPrice=599'} className="savings-card accent-card">
            <span className="savings-title">Under Rs 599 Store</span>
            <span className="savings-action">Shop Now ›</span>
          </Link>
        </div>
      </section>

      {/* 9. Bestsellers Section */}
      <section className="bestsellers-section">
        <h2 className="section-main-title">Bestsellers</h2>
        {loadingBestsellers ? (
          <Loader />
        ) : (
          <div className="bestsellers-carousel-wrapper">
            <button className="carousel-arrow arrow-left" onClick={() => handleScroll(scrollRef, 'left')} aria-label="Slide Left">‹</button>
            <div className="bestsellers-scroll-container" ref={scrollRef}>
              {bestsellers.slice(0, 12).map((product) => (
                <div className="bestseller-card-wrap" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <button className="carousel-arrow arrow-right" onClick={() => handleScroll(scrollRef, 'right')} aria-label="Slide Right">›</button>
          </div>
        )}
        <div className="explore-all-btn-wrap">
          <Link to={gender === 'women' ? '/women-clothing' : '/men-clothing'} className="explore-all-link">
            Explore All
          </Link>
        </div>
      </section>

      {/* 10. Hot Summer Picks Section */}
      <section className="bestsellers-section">
        <h2 className="section-main-title">Hot Summer Picks</h2>
        {loadingSummerPicks ? (
          <Loader />
        ) : (
          <div className="bestsellers-carousel-wrapper">
            <button className="carousel-arrow arrow-left" onClick={() => handleScroll(summerPicksScrollRef, 'left')} aria-label="Slide Left">‹</button>
            <div className="bestsellers-scroll-container" ref={summerPicksScrollRef}>
              {(summerPicks.length > 0 ? summerPicks : bestsellers).slice(0, 12).map((product) => (
                <div className="bestseller-card-wrap" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <button className="carousel-arrow arrow-right" onClick={() => handleScroll(summerPicksScrollRef, 'right')} aria-label="Slide Right">›</button>
          </div>
        )}
        <div className="explore-all-btn-wrap">
          <Link to={gender === 'women' ? '/women-clothing?category=vest,boxers,pyjamas,shorts' : '/men-clothing?category=vest,boxers,pyjamas,shorts'} className="explore-all-link">
            Explore All
          </Link>
        </div>
      </section>

      {/* 11. SEO Description Paragraph Blocks */}
      <section className="homepage-seo-section">
        <div className="seo-container">
          <h3 className="seo-heading">BEWAKOOF® THE NEW AGE ONLINE SHOPPING EXPERIENCE.</h3>
          <p className="seo-text">
            Founded in 2012, Bewakoof® is a lifestyle fashion brand that makes creative, distinctive fashion for the trendy, contemporary Indian. Bewakoof® was created on the principle of creating impact through innovation, honesty and thoughtfulness.
          </p>
          <p className="seo-text">
            With a team of 400 members, and 2mn products sold till date. We like to experiment freely, which allows us to balance creativity and relatability, and our innovative designs. Our range of products is always fresh and up-to-date, and we clock sales of over 1 lakh products a month. Our innovation focus extends to our operations as well. We are vertically integrated, manufacture our own products, and cut out the middleman wherever possible. This direct-to-consumer model allows us to create high-quality fashion at affordable prices. A thoughtful brand, we actively attempt to minimize our environmental footprint and maximize our social impact. These efforts are integrated right into our day-to-day operations, from rainwater harvesting to paper packaging to employee benefits. To create an accessible, affordable and thoughtful experience of online shopping in India.
          </p>

          <h4 className="seo-sub-heading">Online Shopping at Bewakoof® is hassle-free, convenient and super-exciting!</h4>
          <p className="seo-text">
            Online Shopping has always been a fun and exciting task for most and more so when the shopping mall is none other than your own house. We have all had days when we have planned trips to the clothing store in advance, dreaming about what we would buy once we get there. Now we wouldn't think twice before indulging in some online shopping. Well, cut to today's time and age, you can do all this from the comfort of your home while enjoying many online shopping offers, right from amazing deals and discounts to one of the most robust user interface amongst most online shopping sites in India, with many shopping filters to make your shopping experience truly hassle free. This in our own words is what we call Bewakoof.com.
          </p>
          <p className="seo-text">
            Bewakoof®, THE place to be when it comes to the coolest in online fashion, offers you fine, high-quality merchandise go ahead and indulge in a bit of online shopping for men and women's fashion. So browse through the exciting categories we have on offer from men's fashion to basic men's clothing as well as wide variety in womenswear and women's clothes to the amazing range of accessories, fill up your carts and get fast home delivery for all orders. All of this topped with our exclusive online shopping offers makes for an exciting, irresistible and uber cool combo! You can even gift some to your near and dear ones while being absolutely certain that it will put a smile on their faces.
          </p>

          <h4 className="seo-sub-heading">OUR PHILOSOPHY</h4>
          <p className="seo-text">
            We believe in creating the kind of fashion, that makes you stand out as they are in line with the latest local and global trends of the industry, but also at the same time offer value for money functionality, with quality materials and comfortable and flattering prints. We try to look into the psyche of our customers, and try to get inspired by the conversations and experiences around us while creating our graphics, to ensure that they are relatable. We believe in constant and consistent innovation to ensure that our fans get nothing short of the best at affordable rates! While most people do not know, we do not outsource the manufacturing of our products, everything from the conception of the designs to the manufacture and the styling that you see on the photographs of the banners and product pages of our website all happen in house! We go from yarn to product and since we're vertically integrated and bring fashion from us directly to your doorstep without any middlemen that also further ensures reliability because for us it is not just about the money but about building the trust and credibility in our fans about our brand. We also make sure to decrease the impact on environment and are building initiatives that will help us with the same, for now by optimizing our processes to use only as much as we need from nature, rain water harvesting and recycling the water from our RO water facility, because we believe that the spirit of Bewakoof® is about creating an impact by breaking conventions and having a different perspective!
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
