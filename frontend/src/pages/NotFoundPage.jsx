import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-number">
          <span className="n-4">4</span>
          <div className="n-circle">
            <div className="n-circle-inner">
              <span className="n-circle-emoji">🤷</span>
            </div>
          </div>
          <span className="n-4">4</span>
        </div>
        <h1 className="notfound-title">Uh oh! Page not found</h1>
        <p className="notfound-sub">Looks like this page went on a shopping spree and got lost. Let's get you back on track!</p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary notfound-btn">🏠 Go Home</Link>
          <Link to="/men-clothing" className="btn btn-outline notfound-btn">👕 Shop Men</Link>
          <Link to="/women-clothing" className="btn btn-outline notfound-btn">👗 Shop Women</Link>
        </div>
        <div className="notfound-suggestions">
          <p className="suggest-label">You might be looking for:</p>
          <div className="suggest-links">
            {[
              { to: '/men-clothing', label: 'T-Shirts' },
              { to: '/women-clothing?category=t-shirt', label: 'Women T-Shirts' },
              { to: '/accessories', label: 'Accessories' },
              { to: '/collaborations', label: 'Collaborations' },
              { to: '/cart', label: 'Cart' },
              { to: '/orders', label: 'My Orders' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="suggest-link">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
