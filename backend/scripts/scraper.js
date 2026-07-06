/**
 * Bewakoof Product Scraper
 * Fetches 200 real products from bewakoof.com listing pages
 * using their public Next.js __NEXT_DATA__ JSON embedded in HTML.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMAGE_BASE_PLP = 'https://images.bewakoof.com/t640';
const IMAGE_BASE_PDP = 'https://images.bewakoof.com/t1080';

const CATEGORIES = [
  { url: 'https://www.bewakoof.com/men-clothing', gender: 'men', pages: 10 },
  { url: 'https://www.bewakoof.com/women-clothing', gender: 'women', pages: 10 },
  { url: 'https://www.bewakoof.com/accessories', gender: 'unisex', pages: 4 },
];

// Local mirror files as fallback
const MIRROR_DIR = path.join(__dirname, '..', '..', 'My Web Sites', 'Bewakoof', 'www.bewakoof.com');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'identity',
      },
      timeout: 30000,
    };
    const req = client.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          redirectUrl = `https://www.bewakoof.com${redirectUrl}`;
        }
        return fetchPage(redirectUrl).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function parseProductsFromHTML(html) {
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return [];
  
  try {
    const data = JSON.parse(match[1]);
    const pageProps = data?.props?.pageProps || {};
    return pageProps?.data?.products || pageProps?.products || [];
  } catch (e) {
    return [];
  }
}

function buildImageUrls(product) {
  const base = product.display_image;
  if (!base || base === '404.html') return [];
  
  const plpImg = `${IMAGE_BASE_PLP}/${base}`;
  const pdpImg1 = `${IMAGE_BASE_PDP}/${base}`;
  
  // Build additional image URLs using the naming pattern: name-id-timestamp-N.jpg
  const allImages = [plpImg];
  
  // From images array (filter out 404 entries)
  if (Array.isArray(product.images)) {
    for (const img of product.images) {
      if (img && img !== '404.html' && img !== base) {
        allImages.push(`${IMAGE_BASE_PDP}/${img}`);
      }
    }
  }
  
  // If images array only has 1 valid item, construct more using pattern
  if (allImages.length < 3 && base) {
    const numMatch = base.match(/^(.+-)(\d+)(\.jpg)$/);
    if (numMatch) {
      const prefix = numMatch[1];
      const ext = numMatch[3];
      for (let i = 2; i <= 6; i++) {
        const candidate = `${prefix}${i}${ext}`;
        if (!allImages.includes(`${IMAGE_BASE_PDP}/${candidate}`)) {
          allImages.push(`${IMAGE_BASE_PDP}/${candidate}`);
        }
      }
    }
  }
  
  return allImages;
}

function mapCategory(cat, gender) {
  const catMap = {
    'T-Shirt': 't-shirt',
    'T-shirt': 't-shirt',
    'Polo T-Shirt': 'polo',
    'Polo T-Shirts': 'polo',
    'Polo Shirt': 'polo',
    'Polo': 'polo',
    'Polos': 'polo',
    'Shirt': 'shirt',
    'Hoodie': 'hoodie',
    'Sweatshirt': 'sweatshirt',
    'Jogger': 'joggers',
    'Joggers': 'joggers',
    'Track Pants': 'trackpants',
    'Shorts': 'shorts',
    'Jeans': 'jeans',
    'Cargo': 'cargo',
    'Jacket': 'jacket',
    'Kurta': 'kurta',
    'Co-ord Set': 'co-ord-set',
    'Bag': 'bag',
    'Bags': 'bag',
    'Backpack': 'bag',
    'Caps': 'cap',
    'Cap': 'cap',
    'Wallet': 'wallet',
    'Wallets': 'wallet',
    'Socks': 'socks',
    'Phone Case': 'phone-case',
    'Mobile Cover': 'phone-case',
    'Bottle': 'bottle',
    'Watch': 'watch',
    'Dress': 't-shirt',
    'Top': 't-shirt',
    'Lounge Pants': 'trackpants',
    'Pyjamas': 'trackpants',
    'Leggings': 'joggers',
  };
  return catMap[cat] || (gender === 'unisex' ? 'other' : 't-shirt');
}

function mapFit(name = '', subtype = '') {
  const text = (name + ' ' + subtype).toLowerCase();
  if (text.includes('oversized')) return 'oversized';
  if (text.includes('slim')) return 'slim';
  if (text.includes('straight')) return 'straight';
  if (text.includes('relaxed')) return 'relaxed';
  if (text.includes('regular')) return 'regular';
  return 'regular';
}

function mapPattern(design = '', tags = []) {
  const text = (design + ' ' + tags.join(' ')).toLowerCase();
  if (text.includes('graphic') || text.includes('print')) return 'graphic';
  if (text.includes('solid')) return 'solid';
  if (text.includes('stripe') || text.includes('striped')) return 'striped';
  if (text.includes('typograph')) return 'typography';
  if (text.includes('abstract')) return 'abstract';
  if (text.includes('check')) return 'checkered';
  return 'graphic';
}

function mapSizes(availSizes = []) {
  const sizeMap = {
    'xs': 'XS', 's': 'S', 'm': 'M', 'l': 'L', 'xl': 'XL',
    '2xl': 'XXL', 'xxl': 'XXL', '3xl': '3XL', 'xxxl': '3XL',
    'standard': 'Free Size', 'free': 'Free Size', 'free size': 'Free Size',
  };
  return availSizes.map(s => {
    const mapped = sizeMap[s?.toLowerCase()];
    return mapped ? { size: mapped, stock: Math.floor(Math.random() * 30) + 5 } : null;
  }).filter(Boolean);
}

function transformProduct(raw, gender) {
  const images = buildImageUrls(raw);
  const category = mapCategory(raw.category, gender);
  const fit = mapFit(raw.name, raw.subtype);
  const pattern = mapPattern(raw.design, raw.tags || []);
  const sizes = mapSizes(raw.available_size);
  
  const price = Number(raw.price) || 499;
  const mrp = Number(raw.mrp) || Math.round(price * 1.4);
  const discountPct = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  
  const collaboration = raw.name?.match(/(?:batman|superman|dc|marvel|nasa|star wars|friends|anime|dragonball|one piece|avengers|harry potter|disney|mickey|pokemon|rick morty|looney|tom jerry)/i)?.[0] || '';
  
  const colors = raw.color_variants?.map(cv => cv.cname).filter(Boolean) || raw.color || [];
  
  return {
    bewakoofId: String(raw.id),
    name: raw.name,
    brand: 'Bewakoof',
    description: (raw.description || '').replace(/<[^>]+>/g, '').trim(),
    category,
    gender,
    subCategory: raw.subtype || '',
    fit,
    images,
    sizes,
    price,
    originalPrice: mrp,
    discountPercent: discountPct,
    color: Array.isArray(raw.color) ? raw.color[0] : raw.color || '',
    colors: colors.slice(0, 15),
    pattern,
    rating: Number(raw.ratings_avg) || Number(raw.average_rating) || (3.5 + Math.random() * 1.5),
    ratingCount: Number(raw.ratings_count) || Number(raw.ratings) || Math.floor(Math.random() * 2000) + 50,
    collaboration: collaboration ? collaboration.charAt(0).toUpperCase() + collaboration.slice(1) : '',
    tags: raw.tags || [],
    isActive: true,
    isFeatured: raw.bestseller || false,
    isTrending: raw.is_trending_now || false,
    url: raw.url || '',
  };
}

async function scrapeFromLiveAndLocal() {
  const allProducts = new Map(); // keyed by bewakoofId to dedup

  // Step 1: Parse local mirror files (guaranteed 60 products)
  console.log('📁 Parsing local HTTrack mirror...');
  const localFiles = [
    { file: 'men-clothing.html', gender: 'men' },
    { file: 'women-clothing.html', gender: 'women' },
    { file: 'accessories.html', gender: 'unisex' },
  ];
  for (const { file, gender } of localFiles) {
    const fp = path.join(MIRROR_DIR, file);
    if (fs.existsSync(fp)) {
      const html = fs.readFileSync(fp, 'utf8');
      const prods = parseProductsFromHTML(html);
      console.log(`  Local ${gender}: ${prods.length} products`);
      for (const p of prods) {
        const mapped = transformProduct(p, gender);
        allProducts.set(mapped.bewakoofId, mapped);
      }
    }
  }

  // Step 2: Scrape live pages for more products
  console.log('\n🌐 Fetching live bewakoof.com pages...');
  for (const cat of CATEGORIES) {
    for (let page = 1; page <= cat.pages; page++) {
      const url = `${cat.url}?page=${page}`;
      console.log(`  Fetching ${url}...`);
      try {
        const html = await fetchPage(url);
        const prods = parseProductsFromHTML(html);
        console.log(`    Found ${prods.length} products`);
        for (const p of prods) {
          const mapped = transformProduct(p, cat.gender);
          allProducts.set(mapped.bewakoofId, mapped);
        }
        // Delay between requests
        await new Promise(r => setTimeout(r, 1500));
      } catch (e) {
        console.log(`    Error: ${e.message}`);
      }
    }
  }

  const products = Array.from(allProducts.values());
  console.log(`\n✅ Total unique products scraped: ${products.length}`);
  
  // Save to JSON for inspection / seeding
  const outPath = path.join(__dirname, '..', 'data', 'scraped_products.json');
  if (!fs.existsSync(path.dirname(outPath))) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
  }
  fs.writeFileSync(outPath, JSON.stringify(products, null, 2));
  console.log(`💾 Saved to backend/data/scraped_products.json`);
  
  return products;
}

module.exports = { scrapeFromLiveAndLocal, transformProduct, parseProductsFromHTML };

if (require.main === module) {
  scrapeFromLiveAndLocal().catch(console.error);
}
