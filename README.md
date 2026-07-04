# Bewakoof.com Full-Stack Clone

A pixel-perfect, full-stack MERN clone of [bewakoof.com](https://www.bewakoof.com/) featuring the premium Montserrat typography, a clean vertical collapsible filter system, dynamic search suggestions, and a live database connection for products, categories, cart, wishlist, and orders.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Styling** | Vanilla CSS (Premium design system matching bewakoof.com) |
| **State** | React Context API |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JWT + bcryptjs |
| **Search** | Fuse.js (fuzzy autocomplete suggestions) + MongoDB text indexing |
| **Fonts** | Google Montserrat weights (400, 500, 600, 700, 800, 900) |

## 📁 Project Structure

```
Bewakoof-clone/
├── frontend/     ← React + Vite app (port 5173)
└── backend/      ← Express API (port 5000)
```

## ⚙️ Setup

### 1. Configure Backend Environment
Create a file named `.env` in the `backend/` directory with the following variables:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bewakoof
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### 2. Configure Frontend Environment
Create a file named `.env` in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies
Install dependencies for both the frontend and backend:
```bash
# Install Backend dependencies
cd backend && npm install

# Install Frontend dependencies
cd ../frontend && npm install
```

### 4. Seed Database
You can populate the MongoDB database with real-looking product data and category assets:
```bash
cd backend && npm run seed
```

### 5. Run Development Servers
Start both servers to begin paired execution:

**Terminal 1 — Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend && npm run dev
```

Now open **http://localhost:5173** in your browser!

## 📋 Features

- ✅ **Homepage** — Auto-advancing banner carousel, gender card grids, premium hover navigation dropdowns.
- ✅ **Men/Women/Accessories Listing** — Dynamically rendered product grids matching the live layout.
- ✅ **Filter Sidebar** — A clean vertical collapsible accordion filter sidebar (Gender, Category, Sizes, Brand, Color swatches, and Design filters) synced live with database product queries.
- ✅ **Fuzzy Autocomplete Search** — Suggestions drop-down matching product names, categories, and tags.
- ✅ **Product Detail Page (PDP)** — High-res image gallery zoom, size button selector, brand tags, and promotional cards.
- ✅ **Auth & User System** — Register, login, jwt cookies, and active session retention.
- ✅ **Cart & Wishlist** — Add to cart, quantity change controls, wishlist toggle states.
- ✅ **Checkout Flow** — Full 3-step checkout simulation (shipping address details → order confirmation).

## 🔑 API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login session |
| GET | `/api/auth/me` | Fetch active user credentials |
| GET | `/api/products` | Retrieve products (supports query filters for sizes, brands, category, gender) |
| GET | `/api/products/search?q=`| Fetch fuzzy search results |
| GET | `/api/products/:id` | Retrieve single product details |
| GET/POST | `/api/cart` | Retrieve and manage user cart items |
| POST | `/api/wishlist/:id` | Toggle wishlist items |
| POST/GET | `/api/orders` | Submit and retrieve customer order history |
