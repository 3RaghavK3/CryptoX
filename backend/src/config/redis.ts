import dotnenv from "dotenv";

dotnenv.config();

import { Redis } from "ioredis";

const client = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});


export default client;
