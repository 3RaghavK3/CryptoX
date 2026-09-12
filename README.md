# CryptoX

A fast and reliable crypto-market explorer that provides real-time data for thousands of coins, global market stats, trending assets, and detailed coin insights. Users can browse coins, view price history, and track favorites with a personal wishlist—all updated automatically for an accurate, up-to-date experience.



## Features

- Real-time market data for thousands of crypto coins  
- Global market overview with essential statistics  
- Trending coins updated frequently  
- Detailed coin pages with price charts, history, and USD/INR switch  
- Infinite scrolling with virtualized lists for smooth performance  
- Redis-backed caching with custom TTL per endpoint  
- Sortable market table across multiple metrics  
- Wishlist support for tracking favorite coins  
- Fully responsive design for mobile, tablet, and desktop  

## Tech Stack

**Client:** React, TailwindCSS, Chart.js, Lucide-React

**Server:** Node.js, Express.js

**Caching:** Redis (Upstash)

**API:** CoinGecko API

## Installation
```bash
git clone https://github.com/3RaghavK3/Crypto-Tracker.git
cd Crypto-Tracker

# Install client
cd client
npm install

# Install server
cd ../server
npm install
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

Client (`client/.env`)
```
VITE_API_URL=your_backend_api_url
```

Server (`server/.env`)
```
PORT=3000
UPSTASH_REDIS_REST_URL=your_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token
CRYPTO_API_KEY=your_coingecko_api_key
```



## Run Locally


```
# Start backend
cd server
npm start

# Start frontend (in a separate terminal)
cd client
npm run dev
```

## Project Structure
```
CRYPTO-TRACKER/
│
├── client/
│   ├── node_modules/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json
│   └── vite.config.js
│
├── server/
│   ├── node_modules/
│   ├── .env
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
│
├── .gitignore
├── .prettierrc
├── .vercelignore
├── package-lock.json
├── package.json
└── README.md

```

## API Reference

#### Get Global Market Data
```http
GET /api/global
```
Returns global cryptocurrency market statistics.

**Cache TTL:** 10 minutes

---

#### Get Market Data (Paginated)
```http
GET /api/market?page=${page}
```

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `page`    | `number` | **Required**. Page number for pagination |

Returns paginated list of 100 coins with sparkline charts and price change percentages.

**Cache TTL:** 5 minutes

---

#### Get Trending Coins
```http
GET /api/trending
```
Returns currently trending cryptocurrencies.

**Cache TTL:** 10 minutes

---

#### Get Coin Details
```http
GET /api/coindetail?id=${id}
```

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `string` | **Required**. Coin ID (e.g., bitcoin)|

Returns detailed information for a specific cryptocurrency.

**Cache TTL:** 5 minutes

---

#### Health Check
```http
GET /health
```
Returns server status.
## Screenshots

**Market Page (Laptop)**  
![Market – Laptop](https://github.com/user-attachments/assets/b920cd43-0c17-463a-9585-97679dadc38a)

**Market Page (Mobile)**  
![Market – Mobile](https://github.com/user-attachments/assets/d313a4ee-07b9-46d4-8878-93a1bbd6e8e5)

**Coin Detail (Laptop)**  
![Coin Detail – Laptop](https://github.com/user-attachments/assets/0ef9f96d-71a2-4fb1-bc16-9a9db665e0a5)

**Trending Coins (Mobile)**  
![Trending – Mobile](https://github.com/user-attachments/assets/c1964062-5597-4e0f-8a6b-93ee7b402cb4)

## Future Improvements / Known Issues

- Add INR pricing to the homepage.
- Expand support to NFTs and other digital assets.
- Introduce AI-based prediction models (classifiers and time series regressors) for price trends.
- Aggregate news and articles for each coin using generative LLMs

