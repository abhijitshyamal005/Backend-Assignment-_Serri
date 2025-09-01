const express = require('express');
const Video = require('../models/video');
const router = express.Router();

// GET /videos - paginated, sorted
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const total = await Video.countDocuments();
  const videos = await Video.find()
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit);
  res.json({ total, page, limit, videos });
});

// GET /videos/search?q= - search API
const { fetchVideosForQuery } = require('../services/youtubeFetcher');
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const words = q.split(/\s+/).filter(Boolean);
  const regex = words.map(w => `(?=.*${w})`).join('');
  const searchRegex = new RegExp(regex, 'i');
  const query = q ? {
    $or: [
      { title: searchRegex },
      { description: searchRegex },
    ]
  } : {};

  // Always fetch from YouTube for new search, then return latest results
  await fetchVideosForQuery(q);
  const total = await Video.countDocuments(query);
  const videos = await Video.find(query)
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit);
  res.json({ total, page, limit, videos });
});

module.exports = router;
