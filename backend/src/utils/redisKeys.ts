export const REDIS_KEYS = {
  MARKET_PAGE: (page: number, sortBy: string, dir: string) => `market:page:${page}:sort:${sortBy}:dir:${dir}`,
  COIN_DETAILS: (coinId: string) => `coin:details:${coinId}`,
  GLOBAL_DATA: 'global:data',
  TRENDING_COINS: 'trending:coins',
};

export const getMarketPageTTL = (page: number): number => {
  if (page === 1) return 180;
  if (page === 2) return 5 * 60;
  if (page >= 3 && page <= 8) return 15 * 60;
  if (page >= 9 && page <= 20) return 60 * 60;
  return 3 * 60 * 60;
};

export const getCoinDetailsTTL = (): number => {
  return 24 * 60 * 60;
};

export const getGlobalTrendingTTL = (): number => {
  return 30 * 60;
};
