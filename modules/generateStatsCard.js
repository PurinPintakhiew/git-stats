const { createCanvas } = require('canvas');

const languageColors = {
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    'C#': '#178600',
    Ruby: '#701516',
    PHP: '#4F5D95',
    TypeScript: '#2b7489',
    Shell: '#89e051',
    Go: '#00ADD8',
    Kotlin: '#F18E33',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Swift: '#ffac45',
    'Objective-C': '#438eff',
    R: '#198CE7',
    Rust: '#dea584',
    Dart: '#00B4AB'
};

const generateStatsCard = async (userData) => {
    try {
        const width = 800;
        const height = 300;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#17202A';
        ctx.fillRect(0, 0, width, height);

        // Center line
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width / 2, 60);
        ctx.lineTo(width / 2, height);
        ctx.stroke();

        //  header
        ctx.font = '22px Arial';
        ctx.fillStyle = '#F7DC6F';
        ctx.fillText(`⭐️`, 50, 30);
        ctx.fillStyle = '#7FFFD4';
        ctx.fillText(`${userData?.basicData?.username}'s GitHub Stats`, 80, 30);

        // Basic data
        ctx.fillStyle = '#fff';
        ctx.font = '18px Arial';
        ctx.fillText(`Join When: ${userData?.basicData?.join_when}`, 50, 80);
        ctx.fillText(`Total Followers: ${userData?.basicData?.followers}`, 50, 110);
        ctx.fillText(`Total Repositories: ${userData?.basicData?.public_repos}`, 50, 140);
        ctx.fillText(`Total Repositories Latest: ${userData?.basicData?.repo_latest_total}`, 50, 170);

        // Language data
        ctx.font = '14px Arial';

        const xStart = 450
        const yStart = 80;
        const rowHeight = 25;
        const colWidth = 200;

        userData?.languages?.forEach((item, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = xStart + col * colWidth;
            const y = yStart + row * rowHeight;

            const color = languageColors[item?.language] || '#FFFFFF';

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x - 10, y - 5, 5, 0, Math.PI * 2, true);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.fillText(`${item?.language}: ${((item?.count / userData?.basicData?.public_repos) * 100).toFixed(2)}%`, x, y);
        });

        return canvas.toBuffer();
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = { generateStatsCard };
