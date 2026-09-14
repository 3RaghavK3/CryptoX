import { Request, Response, NextFunction } from "express";
import * as usersService from "../04-services/users.service.js";
import AppError from "../utils/AppError.js";
import redis from "../config/redis.js";

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new AppError(401, "Unauthorized"));
    }
    const settings = await usersService.getUserSettings(userId);
    if (!settings) {
      return next(new AppError(404, "User not found"));
    }

    const preferredCurrency = settings.preferred_currency || "USD";
    let currencyMultiplier = 1;

    if (preferredCurrency !== "USD") {
      const ratesStr = await redis.get("exchange_rates:USD");
      if (ratesStr) {
        const rates = JSON.parse(ratesStr);
        if (rates[preferredCurrency]) {
          currencyMultiplier = rates[preferredCurrency];
        }
      }
    }

    res.status(200).json({
      userId: settings.user_id,
      name: settings.name,
      email: settings.email,
      preferredCurrency,
      currencyMultiplier,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCurrency = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new AppError(401, "Unauthorized"));
    }

    const { currency } = req.body;
    const updatedUser = await usersService.updatePreferredCurrency(userId, currency);

    if (!updatedUser) {
      return next(new AppError(404, "User not found"));
    }

    res.status(200).json({
      message: "Preferred currency updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
