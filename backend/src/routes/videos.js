const express = require('express');
const router = express.Router();
const Video = require('../models/video');

// GET /videos - paginated, sorted from DB
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const sortField = req.query.sort || 'publishedAt';
  const sortOrder = req.query.order === 'asc' ? 1 : -1;
  const channel = req.query.channel;
  const filter = {};
  if (channel) filter.channelTitle = { $regex: channel, $options: 'i' };
  try {
    const total = await Video.countDocuments(filter);
    const videos = await Video.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);
    res.json({ total, page, limit, videos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /videos/search?q= - always fetch from YouTube API, show results, then store in DB in background
const { fetchAndStoreVideos } = require('../services/youtubeFetcher');
const axios = require('axios');
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const source = req.query.source;

  if (source === 'db') {
    // Search in the database only
    const words = q.split(/\s+/).filter(Boolean);
    const regex = words.map(w => `(?=.*${w})`).join('');
    const searchRegex = new RegExp(regex, 'i');
    const queryObj = q ? {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
      ]
    } : {};
    if (req.query.channel) {
      queryObj.channelTitle = { $regex: req.query.channel, $options: 'i' };
    }
    const sortField = req.query.sort || 'publishedAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    try {
      const total = await Video.countDocuments(queryObj);
      const videos = await Video.find(queryObj)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit);
      return res.json({ total, page, limit, videos });
    } catch (err) {
      return res.status(500).json({ message: 'Server/database error: ' + (err.message || 'Unknown error') });
    }
  }

  // Default: fetch from YouTube API and show immediately, then store in DB
  const apiKeyManager = require('../utils/apiKeyManager');
  const config = require('../config');
  const apiKey = new apiKeyManager(config.YOUTUBE_API_KEYS);
  let params = {
    part: 'snippet',
    q,
    type: 'video',
    order: 'date',
    maxResults: limit,
    key: apiKey.getKey(),
  };
  try {
    // Always fetch from YouTube API first
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', { params });
    const items = response.data.items || [];
    const videos = items.map(item => {
      const v = item.snippet;
      return {
        videoId: item.id.videoId,
        title: v.title,
        description: v.description,
        publishedAt: v.publishedAt,
        thumbnails: v.thumbnails,
        channelTitle: v.channelTitle,
        raw: item,
      };
    });
    // Respond immediately with fetched videos
    res.json({ total: videos.length, page, limit, videos });
    // Store in DB in background
    fetchAndStoreVideos(q).catch(() => {});
  } catch (err) {
    res.status(502).json({ message: 'Failed to fetch from YouTube API: ' + (err.response?.data?.error?.message || err.message) });
  }
});

module.exports = router;
