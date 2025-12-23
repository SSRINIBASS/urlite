const db = require('../config/db');
const redisClient = require('../config/redis'); // Import Redis
const { nanoid } = require('nanoid');

exports.shortenUrl = async (req, res) => {
  // ... (Keep this function exactly the same as before) ...
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: 'URL is required' });

  try {
    const shortCode = nanoid(6);
    const result = await db.query(
      'INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *',
      [originalUrl, shortCode]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Shorten Error:", err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getUrl = async (req, res) => {
  const { code } = req.params;
  try {
    // 1. CACHE CHECK (Same as before)
    const cachedUrl = await redisClient.get(code);
    if (cachedUrl) {
      console.log(`⚡ Cache Hit for ${code}`);
      
      // NEW: Don't touch DB. Just push to Queue!
      // lPush = Left Push to the 'clicks' list
      redisClient.lPush('clicks', code);
      
      return res.redirect(cachedUrl);
    }

    // 2. DB CHECK (Same as before)
    console.log(`🐢 Cache Miss for ${code}`);
    const result = await db.query('SELECT original_url FROM urls WHERE short_code = $1', [code]);
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'URL not found' });

    const originalUrl = result.rows[0].original_url;

    // 3. SET CACHE (Same as before)
    await redisClient.set(code, originalUrl, { EX: 3600 });

    // NEW: Push to Queue here too!
    redisClient.lPush('clicks', code);

    res.redirect(originalUrl);

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getStats = async (req, res) => {
  const { code } = req.params;
  try {
    const result = await db.query('SELECT * FROM urls WHERE short_code = $1', [code]);
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'URL not found' });

    res.json(result.rows[0]); // Returns { original_url, short_code, clicks, ... }
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ error: 'Server Error' });
  }
};