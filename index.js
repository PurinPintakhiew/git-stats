const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// --- modules
const { getUserData } = require('./modules/getUserData');
const { generateStatsCanvas } = require('./modules/generateStats');

const app = express();

app.use(cors({
  origin: 'https://github.com',
  optionsSuccessStatus: 200,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.get('/api/stats', async (req, res) => {
  try {
    const username = req?.query?.username;

    if (!username) {
      return res.status(400).json({ message: 'Username is missing' });
    }

    const userData = await getUserData(username);

    if (!userData) {
      return res.status(404).json({ message: 'User not found or error fetching data' });
    }

    const buffer = await generateStatsCanvas(userData);

    if (!buffer) {
      return res.status(500).json({ message: 'Error generating stats card' });
    }

    res.set('Content-Type', 'image/png');
    return res.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use('/', (req, res) => {
  return res.status(200).json({ message: 'Hello Everyone' });
});

app.use((req, res) => {
  try {
    return res.status(404).json({ message: 'This request does not exist.' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
