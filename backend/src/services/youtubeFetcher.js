const axios = require('axios');
const Video = require('../models/video');
const ApiKeyManager = require('../utils/apiKeyManager');
const config = require('../config');

const apiKeyManager = new ApiKeyManager(config.YOUTUBE_API_KEYS);
let lastFetchTime = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago

// Fetch videos for a given query and store in DB
async function fetchAndStoreVideos(query, publishedAfter = null) {
  let url = `https://www.googleapis.com/youtube/v3/search`;
  let params = {
    part: 'snippet',
    q: query,
    type: 'video',
    order: 'date',
    maxResults: 20,
    key: apiKeyManager.getKey(),
  };
  if (publishedAfter) params.publishedAfter = publishedAfter;
  try {
    const res = await axios.get(url, { params });
    const items = res.data.items || [];
    for (const item of items) {
      const v = item.snippet;
      await Video.updateOne(
        { videoId: item.id.videoId },
        {
          videoId: item.id.videoId,
          title: v.title,
          description: v.description,
          publishedAt: v.publishedAt,
          thumbnails: v.thumbnails,
          channelTitle: v.channelTitle,
          raw: item,
        },
        { upsert: true }
      );
    }
    return items.length;
  } catch (err) {
    if (err.response && err.response.status === 403) {
      apiKeyManager.rotateKey();
    }
    console.log('Error fetching videos from Youtube API :', err.message);
    
    return 0;
  }
}

// Background fetcher
async function fetchLatestVideos() {
  let publishedAfter = lastFetchTime.toISOString();
  await fetchAndStoreVideos(config.YOUTUBE_SEARCH_QUERY, publishedAfter);
  lastFetchTime = new Date();
}

function startFetcher() {
  setInterval(fetchLatestVideos, config.FETCH_INTERVAL);
  fetchLatestVideos();
}

module.exports = { startFetcher, fetchAndStoreVideos };
