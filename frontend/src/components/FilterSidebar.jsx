import { useState } from 'react';
import './FilterSidebar.css';

/* Realistic mock counts mapping to match real website clone */
const MOCK_COUNTS = {
  // Genders
  men: 2969,
  women: 1842,
  
  // Categories
  't-shirt': 1572,
  'shirt': 322,
  'hoodie': 222,
  'sweatshirt': 117,
  'joggers': 85,
  'trackpants': 54,
  'shorts': 42,
  'jeans': 38,
  'cargo': 29,
  'jacket': 22,
  'kurta': 11,
  'co-ord-set': 64,
  'dresses': 142,
  'kurtis': 98,
  'bag': 94,
  'cap': 72,
  'wallet': 48,
  'socks': 36,
  'phone-case': 245,
  'bottle': 18,
  'watch': 54,
};

const CATEGORY_OPTIONS = {
  men: [
    { value: 't-shirt', label: 'T-Shirt' },
    { value: 'shirt', label: 'Shirt' },
    { value: 'hoodie', label: 'Hoodies' },
    { value: 'sweatshirt', label: 'Sweatshirt' },
    { value: 'joggers', label: 'Joggers' },
    { value: 'trackpants', label: 'Trackpants' },
    { value: 'shorts', label: 'Shorts' },
    { value: 'jeans', label: 'Jeans' },
    { value: 'cargo', label: 'Cargo' },
    { value: 'jacket', label: 'Jacket' },
    { value: 'kurta', label: 'Kurta' },
  ],
  women: [
    { value: 't-shirt', label: 'T-Shirt' },
    { value: 'shirt', label: 'Shirt' },
    { value: 'hoodie', label: 'Hoodies' },
    { value: 'sweatshirt', label: 'Sweatshirt' },
    { value: 'joggers', label: 'Joggers' },
    { value: 'shorts', label: 'Shorts' },
    { value: 'jeans', label: 'Jeans' },
    { value: 'co-ord-set', label: 'Co-ord Sets' },
    { value: 'kurta', label: 'Kurta' },
    { value: 'jacket', label: 'Jacket' },
    { value: 'dresses', label: 'Dresses' },
  ],
  accessories: [
    { value: 'bag', label: 'Bags' },
    { value: 'cap', label: 'Caps' },
    { value: 'wallet', label: 'Wallets' },
    { value: 'socks', label: 'Socks' },
    { value: 'phone-case', label: 'Phone Cases' },
    { value: 'bottle', label: 'Bottles' },
    { value: 'watch', label: 'Watches' },
  ],
};

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];

const COLORS = [
  { value: 'black',    hex: '#000000', label: 'Black' },
  { value: 'white',    hex: '#FFFFFF', label: 'White' },
  { value: 'navy',     hex: '#1F305E', label: 'Navy' },
  { value: 'grey',     hex: '#9E9E9E', label: 'Grey' },
  { value: 'maroon',   hex: '#800000', label: 'Maroon' },
  { value: 'red',      hex: '#E53935', label: 'Red' },
  { value: 'blue',     hex: '#1565C0', label: 'Blue' },
  { value: 'yellow',   hex: '#FDD835', label: 'Yellow' },
  { value: 'orange',   hex: '#FB8C00', label: 'Orange' },
  { value: 'green',    hex: '#388E3C', label: 'Green' },
  { value: 'olive',    hex: '#808000', label: 'Olive' },
  { value: 'pink',     hex: '#E91E8C', label: 'Pink' },
  { value: 'lavender', hex: '#9575CD', label: 'Lavender' },
  { value: 'beige',    hex: '#F5F0DC', label: 'Beige' },
  { value: 'brown',    hex: '#795548', label: 'Brown' },
];

const FIT_OPTIONS = [
  { value: 'oversized', label: 'Oversized' },
  { value: 'regular',   label: 'Regular' },
  { value: 'straight',  label: 'Straight' },
  { value: 'slim',      label: 'Slim' },
  { value: 'relaxed',   label: 'Relaxed' },
];

const DISCOUNT_OPTIONS = [
  { value: '10', label: '10% and above' },
  { value: '20', label: '20% and above' },
  { value: '30', label: '30% and above' },
  { value: '40', label: '40% and above' },
  { value: '50', label: '50% and above' },
];

const RATING_OPTIONS = [
  { value: '4', label: '4★ & above' },
  { value: '3', label: '3★ & above' },
  { value: '2', label: '2★ & above' },
];

/* Collapsible filter section */
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="fs-section">
      <button className="fs-section-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <svg
          className={`fs-chevron ${open ? 'expanded' : 'collapsed'}`}
          width="16" height="16"
          viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="fs-section-body">{children}</div>}
    </div>
  );
};

const FilterSidebar = ({ gender = 'men', filters, onChange, onClear }) => {
  const catOptions = CATEGORY_OPTIONS[gender] || CATEGORY_OPTIONS.men;

  /* Multi-value toggle helper */
  const toggle = (key, value) => {
    const current = filters[key] ? filters[key].split(',').filter(Boolean) : [];
    const idx = current.indexOf(String(value));
    if (idx === -1) current.push(String(value));
    else current.splice(idx, 1);
    onChange({ ...filters, [key]: current.join(',') });
  };

  const isChecked = (key, value) => {
    const current = filters[key] ? filters[key].split(',') : [];
    return current.includes(String(value));
  };

  const hasActive = Object.values(filters).some(Boolean);

  return (
    <aside className="filter-sidebar">
      {/* Header row: "Filters   Clear All" */}
      <div className="fs-header">
        <span className="fs-title">Filters</span>
        <button className="fs-clear-all" onClick={onClear}>Clear All</button>
      </div>

      {/* ── GENDER ── */}
      <FilterSection title="Gender">
        <div className="fs-checkbox-list">
          <label className="fs-checkbox-row">
            <div className="fs-checkbox-left">
              <input
                type="checkbox"
                checked={gender === 'men'}
                readOnly
              />
              <span className="fs-checkbox-mark" />
              <span className="fs-checkbox-label">Men</span>
            </div>
            <span className="fs-checkbox-count">({MOCK_COUNTS.men})</span>
          </label>
          <label className="fs-checkbox-row">
            <div className="fs-checkbox-left">
              <input
                type="checkbox"
                checked={gender === 'women'}
                readOnly
              />
              <span className="fs-checkbox-mark" />
              <span className="fs-checkbox-label">Women</span>
            </div>
            <span className="fs-checkbox-count">({MOCK_COUNTS.women})</span>
          </label>
        </div>
      </FilterSection>

      {/* ── CATEGORY ── */}
      <FilterSection title="Category">
        <div className="fs-checkbox-list">
          {catOptions.map((cat) => (
            <label key={cat.value} className="fs-checkbox-row">
              <div className="fs-checkbox-left">
                <input
                  type="checkbox"
                  checked={isChecked('category', cat.value)}
                  onChange={() => toggle('category', cat.value)}
                />
                <span className="fs-checkbox-mark" />
                <span className="fs-checkbox-label">{cat.label}</span>
              </div>
              <span className="fs-checkbox-count">({MOCK_COUNTS[cat.value] || 15})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* ── SIZE ── */}
      <FilterSection title="Size">
        <div className="fs-size-grid">
          {SIZES.map((size) => (
            <button
              key={size}
              className={`fs-size-chip ${isChecked('size', size) ? 'active' : ''}`}
              onClick={() => toggle('size', size)}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ── COLOR ── */}
      <FilterSection title="Color">
        <div className="fs-color-grid">
          {COLORS.map((c) => (
            <button
              key={c.value}
              className={`fs-color-swatch ${isChecked('color', c.value) ? 'active' : ''}`}
              style={{ backgroundColor: c.hex, border: c.hex === '#FFFFFF' ? '1px solid #ccc' : 'none' }}
              title={c.label}
              onClick={() => toggle('color', c.value)}
            >
              {isChecked('color', c.value) && (
                <svg viewBox="0 0 24 24" fill="none" stroke={c.hex === '#FFFFFF' || c.hex === '#FDD835' || c.hex === '#F5F0DC' ? '#222' : '#fff'} strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ── FIT ── */}
      <FilterSection title="Fit">
        <div className="fs-checkbox-list">
          {FIT_OPTIONS.map((fit) => (
            <label key={fit.value} className="fs-checkbox-row">
              <div className="fs-checkbox-left">
                <input
                  type="checkbox"
                  checked={isChecked('fit', fit.value)}
                  onChange={() => toggle('fit', fit.value)}
                />
                <span className="fs-checkbox-mark" />
                <span className="fs-checkbox-label">{fit.label}</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* ── PRICE RANGE ── */}
      <FilterSection title="Price Range" defaultOpen={false}>
        <div className="fs-price-row">
          <div className="fs-price-input-wrap">
            <span className="fs-rupee">₹</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
              className="fs-price-input"
              min="0"
            />
          </div>
          <span className="fs-price-sep">to</span>
          <div className="fs-price-input-wrap">
            <span className="fs-rupee">₹</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
              className="fs-price-input"
              min="0"
            />
          </div>
        </div>
      </FilterSection>

      {/* ── DISCOUNT ── */}
      <FilterSection title="Discount" defaultOpen={false}>
        <div className="fs-checkbox-list">
          {DISCOUNT_OPTIONS.map((d) => (
            <label key={d.value} className="fs-checkbox-row">
              <div className="fs-checkbox-left">
                <input
                  type="checkbox"
                  checked={isChecked('discount', d.value)}
                  onChange={() => onChange({ ...filters, discount: isChecked('discount', d.value) ? '' : d.value })}
                />
                <span className="fs-checkbox-mark" />
                <span className="fs-checkbox-label">{d.label}</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* ── RATINGS ── */}
      <FilterSection title="Ratings" defaultOpen={false}>
        <div className="fs-checkbox-list">
          {RATING_OPTIONS.map((r) => (
            <label key={r.value} className="fs-checkbox-row">
              <div className="fs-checkbox-left">
                <input
                  type="checkbox"
                  checked={isChecked('rating', r.value)}
                  onChange={() => onChange({ ...filters, rating: isChecked('rating', r.value) ? '' : r.value })}
                />
                <span className="fs-checkbox-mark" />
                <span className="fs-checkbox-label">{r.label}</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
};

export default FilterSidebar;
