const { Pool } = require('pg');
const { createClient } = require('redis');

// 1. Setup Postgres Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@db:5432/myapp',
});

// 2. Setup Redis Connection
const redisClient = createClient({
  url: 'redis://redis:6379'
});

async function processQueue() {
  await redisClient.connect();
  console.log('👷 Worker connected to Redis & DB. Waiting for work...');

  while (true) {
    try {
      // "brPop" = Blocking Right Pop. It waits here forever until an item arrives.
      // We listen to the 'clicks' queue.
      const result = await redisClient.brPop('clicks', 0);
      
      // result looks like: { key: 'clicks', element: 'shortCode123' }
      const shortCode = result.element;
      
      console.log(`🔨 Processing click for: ${shortCode}`);

      // Update the DB
      await pool.query('UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1', [shortCode]);
      
    } catch (err) {
      console.error("Worker Error:", err);
      // Wait 5 seconds before restarting loop if connection fails
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

processQueue();