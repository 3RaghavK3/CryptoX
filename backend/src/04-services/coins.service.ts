import * as coinsRepository from "../05-repository/coins.repository.js";
import * as coingeckoService from "./coingecko.service.js";
import redisClient from "../config/redis.js";
import { REDIS_KEYS, getMarketPageTTL, getCoinDetailsTTL, getGlobalTrendingTTL } from "../utils/redisKeys.js";

export const getMarketsFromDb = async (page: number, perPage: number, sortBy: string, dir: string) => {
    const cacheKey = REDIS_KEYS.MARKET_PAGE(page, sortBy, dir);
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const data = await coinsRepository.getMarketsFromDb(page, perPage, sortBy, dir);
    
    if (data) {
        await redisClient.setex(cacheKey, getMarketPageTTL(page), JSON.stringify(data));
    }

    return data;
};

export const getCoinDetailFromDb = async (coinId: string) => {
    const cacheKey = REDIS_KEYS.COIN_DETAILS(coinId);
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    let dbData = await coinsRepository.getCoinDetailFromDb(coinId);

    if (dbData && dbData.detail_last_synced_at == null) {
        try {
            const apiData = await coingeckoService.getCoinDetail(coinId);
            dbData = {
                ...dbData,
                description: apiData.description?.en || null,
                categories: apiData.categories || [],
                homepage: apiData.links?.homepage || [],
                whitepaper: apiData.links?.whitepaper || null,
                twitter_username: apiData.links?.twitter_screen_name || null,
                subreddit_url: apiData.links?.subreddit_url || null,
                github_repositories: apiData.links?.repos_url?.github || [],
                platforms: apiData.platforms,
                sentiment_votes_up_percentage: apiData.sentiment_votes_up_percentage,
                sentiment_votes_down_percentage: apiData.sentiment_votes_down_percentage,
                watchlist_portfolio_users: apiData.watchlist_portfolio_users,
                developer_data: apiData.developer_data,
                community_data: apiData.community_data,
                detail_last_updated: apiData.last_updated
            };

            coinsRepository.upsertDetail(coinId, apiData).catch((err) => {
                console.error(`Failed to async upsert coin detail for ${coinId}:`, err);
            });
        } catch (error: any) {
            console.error(`Failed to fetch coin detail for ${coinId} from CoinGecko:`, error.message);
        }
    }

    if (dbData) {
        await redisClient.setex(cacheKey, getCoinDetailsTTL(), JSON.stringify(dbData));
    }

    return dbData;
};

export const getGlobalDataFromDb = async () => {
    const cacheKey = REDIS_KEYS.GLOBAL_DATA;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const data = await coinsRepository.getGlobalDataFromDb();

    if (data) {
        await redisClient.setex(cacheKey, getGlobalTrendingTTL(), JSON.stringify(data));
    }

    return data;
};

export const getTrendingCoinsFromDb = async () => {
    const cacheKey = REDIS_KEYS.TRENDING_COINS + '_v2';
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const data = await coinsRepository.getTrendingCoinsFromDb();

    if (data) {
        await redisClient.setex(cacheKey, getGlobalTrendingTTL(), JSON.stringify(data));
    }

    return data;
};