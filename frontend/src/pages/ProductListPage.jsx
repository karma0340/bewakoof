import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Loader from '../components/Loader';
import './ProductListPage.css';

const baseUrl = import.meta.env.VITE_API_URL || '';
const API = baseUrl ? (baseUrl.endsWith('/api') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/api`) : '/api';

const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Discount', value: 'discount' },
];

const ProductListPage = ({ gender, title, bannerSrc }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('popularity');
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    size: '',
    color: '',
    pattern: '',
    fit: searchParams.get('fit') || '',
    collaboration: '',
    minPrice: '',
    maxPrice: '',
    discount: '',
    rating: '',
  });

  // Re-read query params when URL changes
  useEffect(() => {
    setFilters(f => ({
      ...f,
      category: searchParams.get('category') || '',
      fit: searchParams.get('fit') || '',
    }));
    setPage(1);
  }, [location.search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(gender && gender !== 'all' ? { gender } : {}),
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
        sort,
        page,
        limit: 20,
      });
      const { data } = await axios.get(`${API}/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [gender, filters, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ category: '', size: '', color: '', pattern: '', fit: '', collaboration: '', minPrice: '', maxPrice: '', discount: '', rating: '' });
    setPage(1);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Page title for breadcrumb
  const pageTitle = gender === 'men' ? 'Men Clothing'
    : gender === 'women' ? 'Women Clothing'
    : 'Accessories';

  return (
    <div className="plp-wrapper">
      {/* FREE SHIPPING promo bar */}
      <div className="plp-promo-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
        <strong>FREE SHIPPING</strong>&nbsp;on all orders above ₹399
      </div>

      <div className="plp-inner">
        {/* Breadcrumb */}
        <div className="plp-breadcrumb">
          <Link to="/">Home</Link>
          <span className="bc-sep">›</span>
          <span>{pageTitle}</span>
        </div>

        {/* Mobile filter/sort bar */}
        <div className="plp-mobile-actions">
          <button className="plp-mobile-btn" onClick={() => setMobileFilterOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Filter {activeFilterCount > 0 && <span className="filter-count-badge">{activeFilterCount}</span>}
          </button>
          <div className="plp-mobile-sort">
            <span>Sort by:</span>
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Main layout: sidebar + content */}
        <div className="plp-layout">

          {/* ── LEFT SIDEBAR ── */}
          <aside className={`plp-sidebar-wrap ${mobileFilterOpen ? 'mobile-open' : ''}`}>
            <div className="plp-sidebar-mobile-header">
              <span>Filters</span>
              <button onClick={() => setMobileFilterOpen(false)}>✕</button>
            </div>
            <FilterSidebar
              gender={gender}
              filters={filters}
              onChange={(f) => { handleFilterChange(f); setMobileFilterOpen(false); }}
              onClear={() => { handleClearFilters(); setMobileFilterOpen(false); }}
            />
          </aside>

          {mobileFilterOpen && (
            <div className="plp-overlay" onClick={() => setMobileFilterOpen(false)} />
          )}

          {/* ── RIGHT CONTENT ── */}
          <div className="plp-content">
            {/* Title + Sort row */}
            <div className="plp-header-row">
              <h1 className="plp-title">
                {title}
                <span className="plp-count">{total.toLocaleString()} Products</span>
              </h1>
              <div className="plp-sort-wrap" onClick={() => setSortOpen(!sortOpen)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>
                Sort by :&nbsp;<strong>{SORT_OPTIONS.find(o => o.value === sort)?.label}</strong>
                <select
                  className="plp-sort-select"
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1); setSortOpen(false); }}
                  onClick={e => e.stopPropagation()}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Banner */}
            {bannerSrc && (
              <div className="plp-content-banner">
                <img src={bannerSrc} alt={title} />
              </div>
            )}

            {loading ? (
              <Loader />
            ) : products.length === 0 ? (
              <div className="plp-empty">
                <div className="plp-empty-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters</p>
                <button className="btn btn-primary btn-sm" onClick={handleClearFilters}>Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="plp-pagination">
                    <button
                      className="page-btn page-btn-arrow"
                      disabled={page <= 1}
                      onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >‹ Prev</button>
                    {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                      // Show pages around current
                      let p;
                      if (pages <= 7) p = i + 1;
                      else if (page <= 4) p = i + 1;
                      else if (page >= pages - 3) p = pages - 6 + i;
                      else p = page - 3 + i;
                      return (
                        <button
                          key={p}
                          className={`page-btn ${p === page ? 'active' : ''}`}
                          onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >{p}</button>
                      );
                    })}
                    <button
                      className="page-btn page-btn-arrow"
                      disabled={page >= pages}
                      onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >Next ›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
