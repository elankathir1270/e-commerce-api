const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB || 0),

  lazyConnect: true,

  maxRetriesPerRequest: 3,

  enableReadyCheck: true,
});

const connectCache = async () => {
  try {
    await redis.connect();

    console.log("Redis Connected");
  } catch (error) {
    console.error("Redis Connection Failed");
    console.error(error.message);
  }
};

redis.on("error", (error) => {
  console.error("Redis Error:", error.message);
});

module.exports = {
  redis,
  connectCache,
};