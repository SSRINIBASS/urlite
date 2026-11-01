const { Pool } = require('pg');
const { createClient } = require('redis');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@db:5432/myapp',
});

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

async function processQueue() {
  await redisClient.connect();
  console.log('Worker connected to Redis and PostgreSQL; waiting for click events...');

  while (true) {
    try {
      const result = await redisClient.brPop('clicks', 0);
      if (!result?.element) continue;

      const shortCode = result.element;
      await pool.query(
        'UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1',
        [shortCode],
      );
      console.log(`Processed click for ${shortCode}`);
    } catch (err) {
      console.error('Worker error:', err);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

processQueue().catch((err) => {
  console.error('Worker failed to start:', err);
  process.exit(1);
});
