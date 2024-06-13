const express = require('express');
require('dotenv').config();

// --- libs
const { getUserData } = require('./libs/getUserData');
const { generateStatsCard } = require('./libs/generateStatsCard');

const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});