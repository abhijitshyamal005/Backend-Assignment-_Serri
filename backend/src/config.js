require('dotenv').config();

module.exports = {
  YOUTUBE_API_KEYS: process.env.YOUTUBE_API_KEYS.split(','),
  YOUTUBE_SEARCH_QUERY: process.env.YOUTUBE_SEARCH_QUERY,
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 3000,
  FETCH_INTERVAL: parseInt(process.env.FETCH_INTERVAL) || 10000,
};
