
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const { startFetcher } = require('./services/youtubeFetcher');
const videosRouter = require('./routes/videos');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/videos', videosRouter);

mongoose.connect(config.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    startFetcher();
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
