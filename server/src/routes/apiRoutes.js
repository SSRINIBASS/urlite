const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

console.log("Loaded Controller Functions:", urlController);

router.post('/shorten', urlController.shortenUrl);
router.get('/:code', urlController.getUrl);
// NEW ROUTE
router.get('/stats/:code', urlController.getStats);

module.exports = router;