const { redis } = require("./client");

// Get value from cache
const get = async (key) => {
  try {
    const value = await redis.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error("Redis GET Error:", error.message);
    return null;
  }
};

//Store value in cache
const set = async ({ key, value, ttlInSeconds }) => {
  try {
    const serializedValue = JSON.stringify(value);
    if (ttlInSeconds) {
      await redis.set(key, serializedValue, "EX", ttlInSeconds);
    } else {
      await redis.set(key, serializedValue);
    }
  } catch (error) {
    console.error("Redis GET Error:", error.message);
    return null;
  }
};

//Delete one cache key
const del = async (key) => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error("Redis GET Error:", error.message);
    return null;
  }
};

//Check if key exists
const exists = async (key) => {
  try {
    return Boolean(await redis.exists(key));
  } catch (error) {
    console.error("Redis GET Error:", error.message);
    return null;
  }
};

//Remove everything
//Delete one cache key
const clear = async () => {
  try {
    await redis.flushdb();
  } catch (error) {
    console.error("Redis GET Error:", error.message);
    return null;
  }
};

const delByPattern = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);

    if (!keys.length) {
      return;
    }

    await redis.del(keys);
  } catch (error) {
    console.error("Redis GET Error:", error.message);
    return null;
  }
};

module.exports = {
  get,
  set,
  del,
  exists,
  clear,
  delByPattern
};
