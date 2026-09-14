import * as exchangeService from "./src/04-services/exchange.service.js";
import redis from "./src/config/redis.js";

async function seed() {
    console.log("Fetching latest exchange rates from Frankfurter API...");
    const rates = await exchangeService.fetchExchangeRates();
    await redis.set("exchange_rates:USD", JSON.stringify(rates));
    console.log("Successfully cached exchange rates to Redis.");
    process.exit(0);
}

seed();
