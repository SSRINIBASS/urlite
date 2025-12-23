const { createClient } = require('redis');

// Connect to the service named 'redis' defined in docker-compose
const client = createClient({
  url: 'redis://redis:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

// Connect immediately
(async () => {
  await client.connect();
  console.log('✅ Connected to Redis Cache!');
})();

module.exports = client;