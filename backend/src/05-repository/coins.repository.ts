
import pool from "../config/db.js";

export const getMarketsFromDb = async (page: number, perPage: number, sortBy: string, dir: string) => {
    const columnMapping: Record<string, string> = {
        rank: 'market_cap_rank',
        market_cap: 'market_cap',
        price: 'current_price',
        change_1h: 'price_change_percentage_1h',
        change_24h: 'price_change_percentage_24h',
        change_7d: 'price_change_percentage_7d',
        volume: 'total_volume',
        name: 'name',
        id: 'coin_id'
    };

    const dbColumn = columnMapping[sortBy] || 'market_cap';
    const direction = dir === 'asc' ? 'ASC' : 'DESC';
    const orderClause = `${dbColumn} ${direction} NULLS LAST`;

    const offset = (page - 1) * perPage;

    const query = `
        SELECT * FROM coins 
        ORDER BY ${orderClause}
        LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(query, [perPage, offset]);
    return result.rows;
};

export const getGlobalDataFromDb = async () => {
    const query = `SELECT * FROM global_market_stats`;
    const result = await pool.query(query);
    return result.rows[0] || null;
};

export const getTrendingCoinsFromDb = async () => {
    const query = `
        SELECT tc.*, c.name, c.symbol, c.image_url, c.current_price, c.market_cap_rank
        FROM trending_coins tc
        JOIN coins c ON tc.coin_id = c.coin_id
        ORDER BY tc.trend_rank ASC
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getCoinDetailFromDb = async (coinId: string) => {
    const query = `
        SELECT
        c.*,
        cd.description,
        cd.categories,
        cd.homepage,
        cd.whitepaper,
        cd.twitter_username,
        cd.subreddit_url,
        cd.github_repositories,
        cd.platforms,
        cd.sentiment_votes_up_percentage,
        cd.sentiment_votes_down_percentage,
        cd.watchlist_portfolio_users,
        cd.developer_data,
        cd.community_data,
        cd.coingecko_last_updated AS detail_coingecko_last_updated,
        cd.last_synced_at AS detail_last_synced_at,
        cd.coin_id AS has_detail
    FROM coins c
    LEFT JOIN coin_detail cd
        ON c.coin_id = cd.coin_id
    WHERE c.coin_id = $1;
    `;
    const result = await pool.query(query, [coinId]);
    return result.rows[0] || null;
};

export const upsertMarketData = async (coins: any[]) => {
    if (coins.length === 0) return;

    const values = [];
    const params = [];
    let paramIndex = 1;

    for (const coin of coins) {
        values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, NOW())`);
        params.push(
            coin.id,
            coin.symbol,
            coin.name,
            coin.image,
            coin.current_price,
            coin.market_cap ?? null,
            coin.market_cap_rank,
            coin.fully_diluted_valuation ?? null,
            coin.total_volume ?? null,
            coin.high_24h,
            coin.low_24h,
            coin.price_change_24h,
            coin.price_change_percentage_24h,
            coin.market_cap_change_24h ?? null,
            coin.market_cap_change_percentage_24h,
            coin.circulating_supply,
            coin.total_supply,
            coin.max_supply,
            coin.ath,
            coin.ath_change_percentage,
            coin.ath_date,
            coin.atl,
            coin.atl_change_percentage,
            coin.atl_date,
            coin.price_change_percentage_1h_in_currency,
            coin.price_change_percentage_7d_in_currency,
            coin.price_change_percentage_14d_in_currency,
            coin.price_change_percentage_30d_in_currency,
            coin.price_change_percentage_200d_in_currency,
            coin.price_change_percentage_1y_in_currency,
            coin.sparkline_in_7d ? JSON.stringify(coin.sparkline_in_7d) : null,
            coin.roi ? JSON.stringify(coin.roi) : null,
            coin.last_updated
        );
    }

    const query = `
        INSERT INTO coins (
            coin_id, symbol, name, image_url, current_price, market_cap, market_cap_rank,
            fully_diluted_valuation, total_volume,
            high_24h, low_24h, price_change_24h, price_change_percentage_24h,
            market_cap_change_24h, market_cap_change_percentage_24h,
            circulating_supply, total_supply, max_supply,
            ath, ath_change_percentage, ath_date,
            atl, atl_change_percentage, atl_date,
            price_change_percentage_1h, price_change_percentage_7d,
            price_change_percentage_14d, price_change_percentage_30d,
            price_change_percentage_200d, price_change_percentage_1y,
            sparkline_7d, roi, coingecko_last_updated, last_synced_at
        ) VALUES ${values.join(", ")}
        ON CONFLICT (coin_id) DO UPDATE SET
            symbol = EXCLUDED.symbol,
            name = EXCLUDED.name,
            image_url = EXCLUDED.image_url,
            current_price = EXCLUDED.current_price,
            market_cap = EXCLUDED.market_cap,
            market_cap_rank = EXCLUDED.market_cap_rank,
            fully_diluted_valuation = EXCLUDED.fully_diluted_valuation,
            total_volume = EXCLUDED.total_volume,
            high_24h = EXCLUDED.high_24h,
            low_24h = EXCLUDED.low_24h,
            price_change_24h = EXCLUDED.price_change_24h,
            price_change_percentage_24h = EXCLUDED.price_change_percentage_24h,
            market_cap_change_24h = EXCLUDED.market_cap_change_24h,
            market_cap_change_percentage_24h = EXCLUDED.market_cap_change_percentage_24h,
            circulating_supply = EXCLUDED.circulating_supply,
            total_supply = EXCLUDED.total_supply,
            max_supply = EXCLUDED.max_supply,
            ath = EXCLUDED.ath,
            ath_change_percentage = EXCLUDED.ath_change_percentage,
            ath_date = EXCLUDED.ath_date,
            atl = EXCLUDED.atl,
            atl_change_percentage = EXCLUDED.atl_change_percentage,
            atl_date = EXCLUDED.atl_date,
            price_change_percentage_1h = EXCLUDED.price_change_percentage_1h,
            price_change_percentage_7d = EXCLUDED.price_change_percentage_7d,
            price_change_percentage_14d = EXCLUDED.price_change_percentage_14d,
            price_change_percentage_30d = EXCLUDED.price_change_percentage_30d,
            price_change_percentage_200d = EXCLUDED.price_change_percentage_200d,
            price_change_percentage_1y = EXCLUDED.price_change_percentage_1y,
            sparkline_7d = EXCLUDED.sparkline_7d,
            roi = EXCLUDED.roi,
            coingecko_last_updated = EXCLUDED.coingecko_last_updated,
            last_synced_at = EXCLUDED.last_synced_at;
    `;

    await pool.query(query, params);
};

export const upsertGlobal = async (globalData: any) => {
    const data = globalData.data;
    if (!data) return;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        await client.query("DELETE FROM global_market_stats");

        const query = `
            INSERT INTO global_market_stats (
                id, total_market_cap, total_volume_24h, market_cap_change_percentage_24h,
                active_cryptocurrencies, last_synced_at
            ) VALUES (
                1, $1, $2, $3, $4, NOW()
            )
        `;

        const params = [
            data.total_market_cap?.usd || 0,
            data.total_volume?.usd || 0,
            data.market_cap_change_percentage_24h_usd || 0,
            data.active_cryptocurrencies || 0
        ];

        await client.query(query, params);
        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
};

export const upsertTrending = async (trendingData: any) => {
    const coins = trendingData.coins;
    if (!coins || coins.length === 0) return;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        await client.query("DELETE FROM trending_coins");

        const values = [];
        const params = [];
        let paramIndex = 1;
        let trendRank = 1;

        for (const coinObj of coins) {
            const item = coinObj.item;
            values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, NOW())`);
            params.push(item.id, trendRank++, item.score || 0);
        }

        const insertTrendingQuery = `
            INSERT INTO trending_coins (coin_id, trend_rank, score, last_synced_at)
            VALUES ${values.join(", ")}
        `;

        await client.query(insertTrendingQuery, params);
        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
};

export const upsertDetail = async (coinId: string, data: any) => {
    const query = `
        INSERT INTO coin_detail (
            coin_id, description, categories, homepage, whitepaper, twitter_username,
            subreddit_url, github_repositories, platforms, sentiment_votes_up_percentage, 
            sentiment_votes_down_percentage, watchlist_portfolio_users, developer_data, 
            community_data, coingecko_last_updated, last_synced_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW()
        )
        ON CONFLICT (coin_id) DO UPDATE SET
            description = EXCLUDED.description,
            categories = EXCLUDED.categories,
            homepage = EXCLUDED.homepage,
            whitepaper = EXCLUDED.whitepaper,
            twitter_username = EXCLUDED.twitter_username,
            subreddit_url = EXCLUDED.subreddit_url,
            github_repositories = EXCLUDED.github_repositories,
            platforms = EXCLUDED.platforms,
            sentiment_votes_up_percentage = EXCLUDED.sentiment_votes_up_percentage,
            sentiment_votes_down_percentage = EXCLUDED.sentiment_votes_down_percentage,
            watchlist_portfolio_users = EXCLUDED.watchlist_portfolio_users,
            developer_data = EXCLUDED.developer_data,
            community_data = EXCLUDED.community_data,
            coingecko_last_updated = EXCLUDED.coingecko_last_updated,
            last_synced_at = EXCLUDED.last_synced_at;
    `;

    const params = [
        coinId,
        data.description?.en || null,
        data.categories || [],
        data.links?.homepage || [],
        data.links?.whitepaper || null,
        data.links?.twitter_screen_name || null,
        data.links?.subreddit_url || null,
        data.links?.repos_url?.github || [],
        data.platforms ? JSON.stringify(data.platforms) : null,
        data.sentiment_votes_up_percentage,
        data.sentiment_votes_down_percentage,
        data.watchlist_portfolio_users,
        data.developer_data ? JSON.stringify(data.developer_data) : null,
        data.community_data ? JSON.stringify(data.community_data) : null,
        data.last_updated
    ];

    await pool.query(query, params);
};

export const getTop100Ids = async () => {
    const query = `
        SELECT cd.coin_id
        FROM coin_detail cd
        JOIN coins c
            ON cd.coin_id = c.coin_id
        WHERE c.market_cap_rank <= 100
    `;
    const result = await pool.query(query);
    return result.rows.map(row => row.coin_id);
};

export const getRemainingIds = async () => {
    const query = `
        SELECT coin_id
        FROM coin_detail
        WHERE coin_id NOT IN (
            SELECT coin_id
            FROM coins
            WHERE market_cap_rank <= 100
        )
        ORDER BY last_synced_at ASC
        LIMIT 100
    `;
    const result = await pool.query(query);
    return result.rows.map(row => row.coin_id);
};

export const coinExists = async (coinId: string) => {
    const query = `SELECT 1 FROM coins WHERE coin_id = $1 LIMIT 1`;
    const result = await pool.query(query, [coinId]);
    return (result.rowCount ?? 0) > 0;
};
