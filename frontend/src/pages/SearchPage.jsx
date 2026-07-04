import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './SearchPage.css';

const baseUrl = import.meta.env.VITE_API_URL || '';
const API = baseUrl ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/api`) : '/api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    axios.get(`${API}/products/search?q=${encodeURIComponent(q)}`).then(({ data }) => {
      setProducts(data.products);
      setTotal(data.total);
    }).finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="search-page container">
      <div className="search-page-header">
        <h1>
          {q ? (
            <>Search results for "<strong>{q}</strong>" {!loading && <span className="search-count">({total} items found)</span>}</>
          ) : 'Search Products'}
        </h1>
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-card-skeleton">
              <div className="skeleton" style={{ aspectRatio: '3/4' }} />
              <div className="skeleton" style={{ height: 14, marginTop: 10, width: '70%' }} />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="search-no-results">
          <div>🔍</div>
          <h3>No results found for "{q}"</h3>
          <p>Check the spelling or try a different keyword</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
