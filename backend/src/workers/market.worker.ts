import { Worker } from "bullmq";
import { connection, marketQueue } from "../config/bullmq.js";
import * as coingeckoService from "../04-services/coingecko.service.js";
import * as exchangeService from "../04-services/exchange.service.js";
import redis from "../config/redis.js";
import {
  upsertMarketData,
  upsertGlobal,
  upsertTrending,
  getTop100Ids,
  getRemainingIds,
  upsertDetail,
} from "../05-repository/coins.repository.js";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function upsertPages(startPage: number, endPage: number) {
  let page = startPage;

  while (page <= endPage) {
    try {
      console.log(`Fetching page ${page}...`);
      const coins = await coingeckoService.getMarkets(
        "usd",
        "market_cap_desc",
        250,
        page,
        true,
        "1h,24h,7d,14d,30d,200d,1y",
      );

      if (!coins || coins.length === 0) {
        console.log(`Page ${page} returned empty. Terminating loop.`);
        break;
      }
      console.log(
        `Fetched ${coins.length} coins on page ${page}. Upserting...`,
      );
      await upsertMarketData(coins);
      page++;
      if (page <= endPage) {
        await delay(1000);
      }
    } catch (error: any) {
      console.error(`Error fetching page ${page}:`, error.message);
      if (error.response?.status === 429) {
        console.log("Rate limited! Cooldown for 5 seconds...");
        await delay(5000);
      } else {
        throw error;
      }
    }
  }
}

async function upsertDetails(coinIds: string[]) {
  console.log(`Syncing metadata for ${coinIds.length} coins...`);
  for (let i = 0; i < coinIds.length; i++) {
    const coinId = coinIds[i];
    try {
      console.log(
        `Fetching metadata for ${coinId} (${i + 1}/${coinIds.length})...`,
      );
      const apiData = await coingeckoService.getCoinDetail(coinId);
      await upsertDetail(coinId, apiData);

      if (i < coinIds.length - 1) {
        await delay(2000);
      }
    } catch (error: any) {
      console.error(`Error fetching metadata for ${coinId}:`, error.message);
      if (error.response?.status === 429) {
        console.log("Rate limited! Cooldown for 60 seconds...");
        await delay(60000);
        i--;
      }
    }
  }
}

const worker = new Worker(
  "market-sync",
  async (job) => {
    console.log(`Processing job ${job.name} (ID: ${job.id})`);

    switch (job.name) {
      case "sync-top250":
        await upsertPages(1, 1);
        break;
      case "sync-251-500":
        await upsertPages(2, 2);
        break;
      case "sync-501-2000":
        await upsertPages(3, 8);
        break;
      case "sync-2001-5000":
        await upsertPages(9, 20);
        break;
      case "sync-5001-plus":
        await upsertPages(21, Infinity);
        break;
      case "sync-global-trending":
        await upsertGlobalAndTrending();
        break;
      case "sync-top100-details": {
        const top100 = await getTop100Ids();
        await upsertDetails(top100);
        break;
      }
      case "sync-remaining-details": {
        const remaining = await getRemainingIds();
        await upsertDetails(remaining);
        break;
      }
      case "sync-exchange-rates": {
        console.log("Fetching latest exchange rates from Frankfurter API...");
        const rates = await exchangeService.fetchExchangeRates();
        await redis.set("exchange_rates:USD", JSON.stringify(rates));
        console.log("Successfully cached exchange rates to Redis.");
        break;
      }
      default:
        console.warn(`Unknown job name: ${job.name}`);
    }
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.name} completed successfully.`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.name} failed with error:`, err);
});

async function upsertGlobalAndTrending() {
  try {
    console.log("Syncing global data...");
    const globalData = await coingeckoService.getGlobalData();
    await upsertGlobal(globalData);
    console.log("Global data synced successfully.");

    console.log("Syncing trending coins...");
    const trendingData = await coingeckoService.getTrendingCoins();
    await upsertTrending(trendingData);
    console.log("Trending coins synced successfully.");
  } catch (error: any) {
    console.error("Error syncing global or trending data:", error.message);
  }
}

const setupJobs = async () => {
  console.log("Clearing old job schedulers...");
  const schedulers = await marketQueue.getJobSchedulers();
  for (const scheduler of schedulers) {
    if (scheduler.id) await marketQueue.removeJobScheduler(scheduler.id);
  }

  console.log("Adding repeatable jobs...");

  await marketQueue.upsertJobScheduler(
    "scheduler-top250",
    { every: 150000 }, // 2.5 mins (TTL: 3 mins)
    { name: "sync-top250", opts: { removeOnComplete: true, removeOnFail: true } },
  );
  await marketQueue.upsertJobScheduler(
    "scheduler-251-500",
    { every: 270000 }, // 4.5 mins (TTL: 5 mins)
    { name: "sync-251-500", opts: { removeOnComplete: true, removeOnFail: true } },
  );
  await marketQueue.upsertJobScheduler(
    "scheduler-501-2000",
    { every: 840000 }, // 14 mins (TTL: 15 mins)
    { name: "sync-501-2000", opts: { removeOnComplete: true, removeOnFail: true } },
  );
  await marketQueue.upsertJobScheduler(
    "scheduler-2001-5000",
    { every: 3420000 }, // 57 mins (TTL: 60 mins)
    { name: "sync-2001-5000", opts: { removeOnComplete: true, removeOnFail: true } },
  );
  await marketQueue.upsertJobScheduler(
    "scheduler-5001-plus",
    { every: 10500000 }, // 2h 55m (TTL: 3 hours)
    { name: "sync-5001-plus", opts: { removeOnComplete: true, removeOnFail: true } },
  );
  await marketQueue.upsertJobScheduler(
    "scheduler-global-trending",
    { every: 1680000 }, // 28 mins (TTL: 30 mins)
    { name: "sync-global-trending", opts: { removeOnComplete: true, removeOnFail: true } },
  );
  await marketQueue.upsertJobScheduler(
    "scheduler-top100-details",
    { every: 84600000 }, // 23.5 hours (TTL: 24 hours)
    { name: "sync-top100-details", opts: { removeOnComplete: true, removeOnFail: true } },
  );
  await marketQueue.upsertJobScheduler(
    "scheduler-remaining-details",
    { every: 85200000 }, // 23h 40m (Staggered)
    { name: "sync-remaining-details", opts: { removeOnComplete: true, removeOnFail: true } },
  );
  await marketQueue.upsertJobScheduler(
    "scheduler-exchange-rates",
    { every: 3420000 }, // 57 mins
    { name: "sync-exchange-rates", opts: { removeOnComplete: true, removeOnFail: true } },
  );

  console.log("Scheduler setup complete.");

  console.log("Adding initial sync for global and trending data to queue...");
  await marketQueue.add(
    "sync-global-trending",
    {},
    { removeOnComplete: true, removeOnFail: true },
  );
  await marketQueue.add(
    "sync-exchange-rates",
    {},
    { removeOnComplete: true, removeOnFail: true },
  );
};

setupJobs().catch(console.error);

console.log("BullMQ Worker started and listening on 'market-sync' queue...");
