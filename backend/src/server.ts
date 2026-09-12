import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import pool from "./config/db.js";
import redis from "./config/redis.js";
import errorHandler from "./02-middleware/errorHandler.js";
import authRoutes from "./01-routes/auth.routes.js";
import coinsRoutes from "./01-routes/coins.routes.js";
import alertsRoutes from "./01-routes/alerts.routes.js";
import wishlistRoutes from "./01-routes/wishlist.routes.js";
import usersRoutes from "./01-routes/users.routes.js";
import exchangeRoutes from "./01-routes/exchange.routes.js";
import portfolioRoutes from "./01-routes/portfolio.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app: Application = express();
const port: number = Number(process.env.PORT) || 3000;

const dbcheck = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to the database");
    return true;
  } catch (e) {
    console.error("Connection to the database failed", e);
    return false;
  }
};

const rdcheck = async () => {
  try {
    await redis.ping();
    console.log("Connected to redis");
    return true;
  } catch (e) {
    console.error("Connection to the redis failed", e);
    return false;
  }
};

async function start() {
  const [db, redis] = await Promise.all([dbcheck(), rdcheck()]);

  if (db && redis) {
    app.listen(port, () => {
      console.log(`Server running on port :${port}`);
    });
  } else {
    console.log("Startup Failed..");
    process.exit(1);
  }
}

app.use(cors({ origin: ['http://localhost:5173', 'https://crypto-tracker-iota-six.vercel.app'], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/coins", coinsRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/exchange", exchangeRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use(errorHandler);
start();
