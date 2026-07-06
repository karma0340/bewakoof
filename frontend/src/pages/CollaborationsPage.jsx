import { Link } from 'react-router-dom';
import './CollaborationsPage.css';

const COLLABS = [
  { name: 'DC Comics', slug: 'dc', logo: 'https://images.bewakoof.com/uploads/grid/app/dc-comics-collab-logo.png', banner: 'https://images.bewakoof.com/uploads/grid/app/1x1-DC-Comics-Collection.jpg', count: 120, color: '#0476D9', description: 'Official DC Universe Collection — Batman, Superman, Flash & more' },
  { name: 'Marvel', slug: 'marvel', logo: 'https://images.bewakoof.com/uploads/grid/app/marvel-collab-logo.png', banner: 'https://images.bewakoof.com/uploads/grid/app/1x1-Marvel-Collection.jpg', count: 95, color: '#ED1D24', description: 'Avengers, Spider-Man, Thor & the whole MCU universe' },
  { name: 'NASA', slug: 'nasa', logo: 'https://images.bewakoof.com/uploads/grid/app/nasa-collab-logo.png', banner: 'https://images.bewakoof.com/uploads/grid/app/1x1-NASA-Collection.jpg', count: 60, color: '#0B3D91', description: 'Space exploration meets street style — official NASA merch' },
  { name: 'Star Wars', slug: 'star wars', logo: 'https://images.bewakoof.com/uploads/grid/app/star-wars-collab-logo.png', banner: 'https://images.bewakoof.com/uploads/grid/app/1x1-Star-Wars-Collection.jpg', count: 75, color: '#FFE81F', description: 'May the Force be with your wardrobe — Darth Vader, Yoda & more' },
  { name: 'Friends', slug: 'friends', logo: 'https://images.bewakoof.com/uploads/grid/app/friends-collab-logo.png', banner: 'https://images.bewakoof.com/uploads/grid/app/1x1-Friends-Collection.jpg', count: 45, color: '#F7CE00', description: 'Could this BE any more stylish? Official Friends TV Show Collection' },
  { name: 'Pokemon', slug: 'pokemon', logo: 'https://images.bewakoof.com/uploads/grid/app/pokemon-collab-logo.png', banner: 'https://images.bewakoof.com/uploads/grid/app/1x1-Pokemon-Collection.jpg', count: 80, color: '#FFCB00', description: 'Gotta wear \'em all! Pikachu, Charizard & the whole Pokédex' },
  { name: 'Harry Potter', slug: 'harry potter', logo: 'https://images.bewakoof.com/uploads/grid/app/harry-potter-collab-logo.png', banner: 'https://images.bewakoof.com/uploads/grid/app/1x1-Harry-Potter-Collection.jpg', count: 55, color: '#740001', description: 'Mischief Managed — Official Warner Bros. Harry Potter Collaboration' },
  { name: 'Disney', slug: 'disney', logo: 'https://images.bewakoof.com/uploads/grid/app/disney-collab-logo.png', banner: 'https://images.bewakoof.com/uploads/grid/app/1x1-Disney-Collection.jpg', count: 100, color: '#004B8D', description: 'Mickey, Minnie, Stitch, Winnie the Pooh & all Disney favourites' },
  { name: 'Rick & Morty', slug: 'rick morty', logo: 'https://images.bewakoof.com/uploads/grid/app/rick-morty-collab-logo.png', banner: 'https://images.bewakoof.com/uploads/grid/app/1x1-Rick-Morty-Collection.jpg', count: 40, color: '#69DC9E', description: 'Wubba Lubba Dub Dub! Rick and Morty limited edition drops' },
  { name: 'Looney Tunes', slug: 'looney', logo: 'https://images.bewakoof.com/uploads/grid/app/looney-tunes-collab-logo.png', banner: 'https://images.bewakoof.com/uploads/grid/app/1x1-Looney-Tunes-Collection.jpg', count: 50, color: '#F9A11B', description: "That's all folks — Bugs Bunny, Tweety, Daffy & more cartoon classics" },
  { name: 'Dragon Ball Z', slug: 'dragonball', logo: 'https://images.bewakoof.com/uploads/grid/app/dbz-collab-logo.png', banner: 'https://images.bewakoof.com/uploads/grid/app/1x1-DBZ-Collection.jpg', count: 35, color: '#FF7800', description: 'Power up your look with official Dragon Ball Z anime collection' },
  { name: 'One Piece', slug: 'one piece', logo: 'https://images.bewakoof.com/uploads/grid/app/one-piece-collab-logo.png', banner: 'https://images.bewakoof.com/uploads/grid/app/1x1-One-Piece-Collection.jpg', count: 30, color: '#D91F26', description: 'Become the King of Pirates with official One Piece merch' },
];

const CollaborationsPage = () => {
  return (
    <div className="collabs-page">
      {/* Hero Banner */}
      <div className="collabs-hero">
        <div className="collabs-hero-content">
          <div className="collabs-hero-subtitle">✨ OFFICIAL COLLABORATIONS</div>
          <h1 className="collabs-hero-title">Fan Merch That Hits Different</h1>
          <p className="collabs-hero-desc">Officially licensed collections from your favourite universes — wear your fandom</p>
        </div>
        <div className="collabs-hero-logos">
          {COLLABS.slice(0, 4).map(c => (
            <div key={c.name} className="hero-logo-pill" style={{ '--col': c.color }}>
              {c.name}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="collabs-stats">
        <div className="collab-stat-item"><strong>12+</strong><span>Official Brands</span></div>
        <div className="collab-stat-item"><strong>750+</strong><span>Exclusive Designs</span></div>
        <div className="collab-stat-item"><strong>100%</strong><span>Licensed Merch</span></div>
        <div className="collab-stat-item"><strong>₹399+</strong><span>Starting Price</span></div>
      </div>

      {/* All Collaborations Grid */}
      <div className="collabs-container">
        <h2 className="collabs-section-title">All Collaborations</h2>
        <div className="collabs-grid">
          {COLLABS.map(collab => (
            <Link
              key={collab.name}
              to={`/men-clothing?collaboration=${encodeURIComponent(collab.slug)}`}
              className="collab-card"
              style={{ '--brand-color': collab.color }}
            >
              <div className="collab-banner-wrap">
                <img
                  src={collab.banner}
                  alt={collab.name}
                  className="collab-banner-img"
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = collab.color;
                  }}
                />
                <div className="collab-overlay">
                  <span className="collab-count">{collab.count}+ styles</span>
                </div>
              </div>
              <div className="collab-info">
                <h3 className="collab-name">{collab.name}</h3>
                <p className="collab-desc">{collab.description}</p>
                <span className="collab-shop-link">Shop Collection →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollaborationsPage;
