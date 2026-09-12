import { Request, Response, NextFunction } from "express";
import redis from "../config/redis.js";

export const getRates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cachedRates = await redis.get("exchange_rates:USD");

    if (!cachedRates) {
      return res.status(200).json({ USD: 1.0 });
    }

    res.status(200).json(JSON.parse(cachedRates));
  } catch (error) {
    next(error);
  }
};
