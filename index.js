require('dotenv').config();
const express = require('express');
const { getUserData } = require('./modules/getUserData');
const { generateStatsCard } = require('./modules/generateStatsCard');
const fs = require('fs');

const app = express();

app.get('/api/stats', async (req, res) => {
  const username = req.query.username;
  const token = process.env.GITHUB_TOKEN;  // Ensure this environment variable is set

  if (!username || !token) {
    return res.status(400).send('Username or token is missing');
  }

  const userData = await getUserData(username, token);

  if (!userData) {
    return res.status(404).send('User not found or error fetching data');
  }

  const buffer = await generateStatsCard(userData);

  if (!buffer) {
    return res.status(500).send('Error generating stats card');
  }

  fs.writeFileSync('stats.png', buffer);

  res.set('Content-Type', 'image/png');
  res.send(buffer);
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