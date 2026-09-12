import { Request, Response, NextFunction } from "express";
import * as coinsService from "../04-services/coins.service.js";
import * as coingeckoService from "../04-services/coingecko.service.js";
import { GetMarketsInput, GetCoinDetailInput, SearchInput } from "../06-validations/coin.validation.js";

export const getMarkets = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            sort_by,
            dir,
            per_page,
            page,
        } = req.query as unknown as GetMarketsInput;

        const result = await coinsService.getMarketsFromDb(
            page,
            per_page,
            sort_by,
            dir
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getCoinDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { coinId } = req.params as unknown as GetCoinDetailInput;
        const result = await coinsService.getCoinDetailFromDb(coinId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getGlobalData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await coinsService.getGlobalDataFromDb();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getTrendingCoins = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await coinsService.getTrendingCoinsFromDb();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const search = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { query } = req.query as unknown as SearchInput;
        const result = await coingeckoService.search(query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};