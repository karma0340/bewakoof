const fs = require('fs');
const path = require('path');

const MIRROR_DIR = path.join(__dirname, '..', '..', 'My Web Sites', 'Bewakoof', 'www.bewakoof.com');

function getProductsFromHTML(filePath, gender) {
  const html = fs.readFileSync(filePath, 'utf8');
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return [];
  
  const data = JSON.parse(match[1]);
  const pageProps = data?.props?.pageProps || {};
  const products = pageProps?.data?.products || pageProps?.products || [];
  
  return products.map(p => ({
    gender,
    // show all image-related fields
    display_image: p.display_image,
    flip_image: p.flip_image,
    images: p.images,
    tribe_image_url: p.tribe_image_url,
    productImage: p.productImage,
    id: p.id,
    name: p.name,
    price: p.price,
    mrp: p.mrp,
    product_discount: p.product_discount,
    available_size: p.available_size,
    category: p.category,
    color: p.color,
    color_variants: p.color_variants?.slice(0,3),
    ratings_avg: p.ratings_avg,
    ratings_count: p.ratings_count,
  }));
}

const allFiles = [
  { file: 'men-clothing.html', gender: 'men' },
  { file: 'women-clothing.html', gender: 'women' },
  { file: 'accessories.html', gender: 'unisex' },
];

let all = [];
for (const { file, gender } of allFiles) {
  const fp = path.join(MIRROR_DIR, file);
  if (fs.existsSync(fp)) {
    const prods = getProductsFromHTML(fp, gender);
    console.log(`${gender}: ${prods.length} products`);
    all = all.concat(prods);
  }
}

console.log('\n=== FIRST PRODUCT IMAGES SAMPLE ===');
const first = all[0];
console.log(JSON.stringify({
  id: first?.id,
  name: first?.name,
  display_image: first?.display_image,
  flip_image: first?.flip_image,
  images: first?.images,
  tribe_image_url: first?.tribe_image_url,
  productImage: first?.productImage,
}, null, 2));

console.log('\n=== SIZES SAMPLE ===');
console.log('available_size:', first?.available_size);

console.log('\n=== PRICE SAMPLE ===');
console.log('price:', first?.price, 'mrp:', first?.mrp, 'discount:', first?.product_discount);
