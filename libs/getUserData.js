const fetch = require('node-fetch');

async function getUserData(username, token) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                Authorization: `token ${token}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return false
    }
}

module.exports = { getUserData };