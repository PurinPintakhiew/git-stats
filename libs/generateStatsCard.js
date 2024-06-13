const { createCanvas, loadImage } = require('canvas');

function generateStatsCard(userData) {
    const width = 400;
    const height = 200;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Username: ${userData.login}`, 50, 50);
    ctx.fillText(`Followers: ${userData.followers}`, 50, 80);
    ctx.fillText(`Repositories: ${userData.public_repos}`, 50, 110);

    return canvas.toBuffer();
}

module.exports = { generateStatsCard };