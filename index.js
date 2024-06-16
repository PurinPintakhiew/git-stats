require('dotenv').config();
const express = require('express');
const { getUserData } = require('./modules/getUserData');
const { generateStatsSharp, generateStatsCanvas } = require('./modules/generateStats');

const app = express();

app.get('/api/stats', async (req, res) => {
  try {
    const username = req?.query?.username;

    if (!username) {
      return res.status(400).json({ message: 'Username is missing' });
    }

    // const userData = await getUserData(username);
    const userData = {
      "basicData": {
        "username": "PurinPintakhiew",
        "followers": 18,
        "public_repos": 29,
        "repo_latest_total": 4,
        "join_when": "17/01/2020"
      },
      "languages": [
        {
          "language": "JavaScript",
          "count": 8
        },
        {
          "language": "PHP",
          "count": 7
        },
        {
          "language": "CSS",
          "count": 1
        },
        {
          "language": "C#",
          "count": 4
        },
        {
          "language": "Python",
          "count": 2
        },
        {
          "language": "Go",
          "count": 1
        },
        {
          "language": "HTML",
          "count": 1
        },
        {
          "language": "TypeScript",
          "count": 2
        },
        {
          "language": "C++",
          "count": 1
        },
        { "language": "Objective-C", "count": 1 }
      ]
    }

    if (!userData) {
      return res.status(404).json({ message: 'User not found or error fetching data', userData: userData });
    }

    const buffer = await generateStatsCanvas(userData);

    if (!buffer) {
      return res.status(500).json({ message: 'Error generating stats card', buffer: buffer });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
