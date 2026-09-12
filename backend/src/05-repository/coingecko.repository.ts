import { coinGeckoMarketApi, coinGeckoDetailApi } from "../config/coingecko.js";
import pool from "../config/db.js";

export const getMarkets = async (
    vsCurrency: string,
    order: string,
    perPage: number,
    page: number,
    sparkline: boolean,
    priceChangePercentage: string
) => {
    const response = await coinGeckoMarketApi.get("/coins/markets", {
        params: {
            vs_currency: vsCurrency,
            order,
            per_page: perPage,
            page,
            sparkline,
            price_change_percentage: priceChangePercentage,
        },
    });

    return response.data;
};

export const getCoinDetail = async (coinId: string) => {
    const response = await coinGeckoDetailApi.get(`/coins/${coinId}`);
    return response.data;
};

export const getGlobalData = async () => {
    const response = await coinGeckoMarketApi.get("/global");
    return response.data;
};

export const getTrendingCoins = async () => {
    const response = await coinGeckoMarketApi.get("/search/trending");
    return response.data;
};

export const search = async (query: string) => {
    const formattedQuery = `${query}%`;
    const result = await pool.query(
        `SELECT coin_id as id, name, symbol, image_url as large
         FROM coins
         WHERE lower(name) LIKE lower($1) OR lower(symbol) LIKE lower($1)
         ORDER BY market_cap_rank ASC NULLS LAST
         LIMIT 5`,
        [formattedQuery]
    );

    return { coins: result.rows };
};
