const { createCanvas } = require('canvas');

async function generateStatsCard(userData) {
    try {
        const width = 800;
        const height = 250;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#17202A';
        ctx.fillRect(0, 0, width, height);

        // Center line
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();

        // Basic data
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(`Username: ${userData.basicData.username}`, 50, 50);
        ctx.fillText(`Followers: ${userData.basicData.followers}`, 50, 80);
        ctx.fillText(`Repositories: ${userData.basicData.public_repos}`, 50, 110);

        // Language data
        ctx.font = '14px Arial';

        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
            '#E7E9ED', '#76A346', '#F5A623', '#F55D3E'
        ];

        const xStart = 450; // Adjusted X position for languages to account for center line
        const yStart = 50;  // Starting Y position for languages
        const rowHeight = 30; // Height of each row
        const colWidth = 200; // Width of each column

        userData.languages.forEach((item, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = xStart + col * colWidth;
            const y = yStart + row * rowHeight;

            // Draw dot
            ctx.fillStyle = colors[index % colors.length];
            ctx.beginPath();
            ctx.arc(x - 10, y - 5, 5, 0, Math.PI * 2, true);
            ctx.fill();

            // Draw text
            ctx.fillStyle = '#fff';
            ctx.fillText(`${item.language}: ${((item.count / userData.basicData.public_repos) * 100).toFixed(2)}%`, x, y);
        });

        return canvas.toBuffer();
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = { generateStatsCard };
