import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const location = useLocation();

  // On landing page /, hide main footer (as / has its own slogan bar)
  if (location.pathname === '/') {
    return null;
  }

  return (
    <footer className="footer-container">
      <div className="footer-inner">
        {/* Brand Logo Row */}
        <div className="footer-logo-row">
          <Link to="/" className="footer-logo-link">
            <span className="footer-logo-yellow-text">bewakoof</span>
            <span className="footer-logo-yellow-tm">®</span>
          </Link>
        </div>

        {/* Links & Subscriptions Grid */}
        <div className="footer-main-grid">
          {/* Col 1: Customer Service */}
          <div className="footer-grid-col">
            <h4 className="footer-col-heading">CUSTOMER SERVICE</h4>
            <ul className="footer-col-list">
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/orders">Track Order</Link></li>
              <li><Link to="/orders">Return Order</Link></li>
              <li><Link to="/orders">Cancel Order</Link></li>
            </ul>
          </div>

          {/* Col 2: Company */}
          <div className="footer-grid-col">
            <h4 className="footer-col-heading">COMPANY</h4>
            <ul className="footer-col-list">
              <li><a href="https://www.bewakoof.com/about-us" target="_blank" rel="noreferrer">About Us</a></li>
              <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><a href="https://www.bewakoof.com/careers" target="_blank" rel="noreferrer">We are Hiring</a></li>
            </ul>
          </div>

          {/* Col 3: Connect With Us */}
          <div className="footer-grid-col">
            <h4 className="footer-col-heading">CONNECT WITH US</h4>
            <div className="footer-social-stats">
              <a href="https://facebook.com/bewakoof" target="_blank" rel="noreferrer" className="social-stat-link">
                <svg className="social-stat-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
                <span className="social-stat-text">4.7M People like this</span>
              </a>
              <a href="https://instagram.com/bewakoof" target="_blank" rel="noreferrer" className="social-stat-link">
                <svg className="social-stat-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
                <span className="social-stat-text">1M People like this</span>
              </a>
            </div>
            {/* Social media grid of 7 icons */}
            <div className="footer-social-icons-row">
              <a href="https://facebook.com/bewakoof" className="social-icon-box" aria-label="Facebook" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
              <a href="https://instagram.com/bewakoof" className="social-icon-box" aria-label="Instagram" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href="https://twitter.com/bewakoof" className="social-icon-box" aria-label="Twitter" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://pinterest.com/bewakoof" className="social-icon-box" aria-label="Pinterest" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.663.967-2.907 2.17-2.907 1.02 0 1.513.769 1.513 1.686 0 1.029-.656 2.568-.994 3.995-.28 1.189.599 2.161 1.775 2.161 2.128 0 3.765-2.244 3.765-5.479 0-2.862-2.061-4.869-5.002-4.869-3.407 0-5.405 2.556-5.405 5.193 0 1.029.394 2.137.89 2.738.1.12.115.224.085.345-.094.393-.3.1.302-.12a.33.33 0 0 0 .223-.08c.097-.109.134-.224.116-.345-.119-.488-.36-1.04-.36-1.686 0-2.33 1.691-4.472 4.887-4.472 2.566 0 4.562 1.83 4.562 4.285 0 2.55-1.606 4.604-3.834 4.604-1.22 0-2.37-1.122-2.37-2.379 0-1.503.95-2.87 1.25-3.82.26-.84-.25-1.549-1.109-1.549-.88 0-1.6 1.02-1.6 2.22 0 .91.31 1.53.31 1.53s-.99 4.19-1.17 4.96c-.32 1.39-.16 3.102-.08 3.21.02.03.07.04.1.01.13-.17 1.84-2.29 2.42-4.4.18-.65.92-3.61.92-3.61s.39.74 1.12.74c2.22 0 3.92-2.02 3.92-5.02 0-4.39-3.13-7.46-7.67-7.46-5.22 0-8.29 3.91-8.29 7.97 0 1.58.6 3.27 1.35 4.17.05.06.06.11.04.17-.05.21-.16.65-.18.73-.02.09-.07.11-.16.07-1.14-.53-1.85-2.21-1.85-3.55C.029 7.79 3.639 2.22 12.016 2.22c6.702 0 11.666 4.786 11.666 10.923 0 6.892-4.341 12.449-10.372 12.449-2.02 0-3.92-1.05-4.57-2.3z"/></svg>
              </a>
              <a href="#" className="social-icon-box" aria-label="Snapchat" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0c-4.22 0-7.85 2.1-10 5.25.13.12.28.2.46.2.5 0 .91-.41.91-.92 0-.32-.16-.6-.4-.76C4.85 1.55 8.21 0 12 0s7.15 1.55 9.03 4.02c-.24.16-.4.44-.4.76 0 .51.41.92.91.92.18 0 .33-.08.46-.2C19.85 2.1 16.22 0 12 0zm0 4.15c-3.12 0-5.83 2-6.84 4.88-.13.38-.2.78-.2 1.2 0 2.22 1.48 4.1 3.51 4.72-.05.15-.07.31-.07.47 0 .76.62 1.38 1.38 1.38s1.38-.62 1.38-1.38c0-.16-.02-.32-.07-.47 2.03-.62 3.51-2.5 3.51-4.72 0-.42-.07-.82-.2-1.2C17.83 6.15 15.12 4.15 12 4.15z"/></svg>
              </a>
              <a href="#" className="social-icon-box" aria-label="Apple" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.51-.62.73-1.16 1.87-1.01 2.98 1.1.09 2.22-.55 2.94-1.43Z"/></svg>
              </a>
              <a href="mailto:care@bewakoof.com" className="social-icon-box" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 4: Keep Up To Date */}
          <div className="footer-grid-col">
            <h4 className="footer-col-heading">KEEP UP TO DATE</h4>
            <form className="footer-subscribe-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter Email Id" 
                className="footer-subscribe-input" 
                required 
              />
              <button type="submit" className="footer-subscribe-btn">SUBSCRIBE</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
