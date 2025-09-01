const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: { type: String, unique: true, index: true },
  title: { type: String, index: 'text' },
  description: { type: String, index: 'text' },
  publishedAt: { type: Date, index: true },
  thumbnails: { type: Object },
  channelTitle: String,
  raw: { type: Object },
}, { timestamps: true });

// Ensure compound text index for better search performance
videoSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Video', videoSchema);
