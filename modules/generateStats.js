const sharp = require('sharp');
const { createCanvas, registerFont } = require('canvas');
const path = require('path');

// Register Font
registerFont(path.resolve('public/fonts/LibreBaskerville-Regular.ttf'), { family: 'Libre Baskerville' });

const languageColors = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    'C#': '#178600',
    Ruby: '#701516',
    PHP: '#777BB4',
    Shell: '#89e051',
    Go: '#00ADD8',
    Kotlin: '#A97BFF',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Swift: '#ffac45',
    Rust: '#dea584',
    Dart: '#00B4AB'
};

const formatPercent = (count, total) => {
    if (!total) return '0%';
    return `${((count / total) * 100).toFixed(1)}%`;
};

const generateStatsCanvas = async (userData) => {
    try {
        const width = 900;
        const height = 420;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const bg = ctx.createLinearGradient(0, 0, width, height);
        bg.addColorStop(0, '#0f172a');
        bg.addColorStop(1, '#1e293b');

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        roundRect(ctx, 25, 25, width - 50, height - 50, 24, true);

        ctx.font = 'bold 32px "Libre Baskerville"';
        ctx.fillStyle = '#ffffff';

        ctx.fillText(
            `${userData?.basicData?.username}'s GitHub Stats`,
            50,
            70
        );

        // Subtitle
        ctx.font = '16px "Libre Baskerville"';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('Developer Overview & Language Usage', 52, 100);

        const stats = [
            {
                title: 'Followers',
                value: userData?.basicData?.followers || 0
            },
            {
                title: 'Repositories',
                value: userData?.basicData?.public_repos || 0
            },
            {
                title: 'Latest Projects',
                value: userData?.basicData?.repo_latest_total || 0
            },
            {
                title: 'Joined',
                value: userData?.basicData?.join_when || 'Unknown'
            }
        ];

        let startY = 140;

        stats.forEach((item, index) => {
            const y = startY + index * 60;

            // Card
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            roundRect(ctx, 45, y, 320, 45, 14, true);

            // Title
            ctx.font = '15px "Libre Baskerville"';
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillText(item.title, 65, y + 20);

            // Value
            ctx.font = 'bold 18px "Libre Baskerville"';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(String(item.value), 65, y + 42);
        });

        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        roundRect(ctx, 400, 130, 450, 235, 18, true);

        ctx.font = 'bold 20px "Libre Baskerville"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Top Languages', 425, 165);

        const languages = userData?.languages || [];

        languages.slice(0, 6).forEach((lang, index) => {
            const y = 205 + index * 28;

            const percent = (
                (lang.count / userData?.basicData?.public_repos) *
                100
            );

            const color = languageColors[lang.language] || '#ffffff';

            // Label
            ctx.font = '15px "Libre Baskerville"';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(lang.language, 425, y);

            // Background Bar
            ctx.fillStyle = 'rgba(255,255,255,0.08)';
            roundRect(ctx, 560, y - 12, 220, 10, 10, true);

            // Progress Bar
            ctx.fillStyle = color;
            roundRect(ctx, 560, y - 12, (220 * percent) / 100, 10, 10, true);

            // Percent
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '14px "Libre Baskerville"';
            ctx.fillText(
                formatPercent(
                    lang.count,
                    userData?.basicData?.public_repos
                ),
                790,
                y
            );
        });

        ctx.font = '13px "Libre Baskerville"';
        ctx.fillStyle = 'rgba(255,255,255,0.45)';

        return canvas.toBuffer('image/png');
    } catch (error) {
        console.error(error);
        return false;
    }
};

function roundRect(ctx, x, y, width, height, radius, fill = false) {
    ctx.beginPath();

    ctx.moveTo(x + radius, y);

    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );

    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);

    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);

    ctx.closePath();

    if (fill) ctx.fill();
}

module.exports = { generateStatsCanvas };