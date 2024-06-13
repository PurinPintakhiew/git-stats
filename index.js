const express = require('express');
require('dotenv').config();

// --- libs
const { getUserData } = require('./modules/getUserData');
const { generateStatsCard } = require('./modules/generateStatsCard');

const app = express();

app.get('/api/stats', async (req, res) => {
  try {
    const username = req?.query?.username;
    const token = process.env.GITHUB_TOKEN;

    if (!username || !token) {
      return res.status(400).json({ error: 'Username and token are required' });
    }

    const userData = await getUserData(username, token);

    if (!userData) {
      return res.status(404).json({ error: 'User not found or error fetching data' });
    }

    const buffer = await generateStatsCard(userData);

    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating stats card:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/', (req, res) => {
    return res.status(200).json({ message: 'Hello Everyone' });
})

app.use((req, res) => {
  try {
    return res.status(404).json({ message: 'This request does not exist.' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});