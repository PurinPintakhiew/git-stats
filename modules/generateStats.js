const sharp = require('sharp');
const path = require('path');

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
    Kotlin: '#F14E33',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Swift: '#ffac45',
    'Objective-C': '#438eff',
    R: '#198CE7',
    Rust: '#dea584',
    Dart: '#00B4AB'
};

const convertTextToPath = (text) => {
    if (!text) return '';

    const pathElems = [];

    // Process each <text> element
    text.match(/<text[^>]*>.*?<\/text>/gs)?.forEach(textElem => {
        // Extract attributes from <text> element
        const xMatch = textElem.match(/x="([^"]*)"/);
        const yMatch = textElem.match(/y="([^"]*)"/);
        const fillMatch = textElem.match(/fill="([^"]*)"/);
        const fontSizeMatch = textElem.match(/font-size="([^"]*)"/);
        const fontFamilyMatch = textElem.match(/font-family="([^"]*)"/);

        if (xMatch && yMatch && fillMatch && fontSizeMatch && fontFamilyMatch) {
            const x = parseFloat(xMatch[1]);
            const y = parseFloat(yMatch[1]);
            const fill = fillMatch[1];
            const fontSize = parseFloat(fontSizeMatch[1]);
            const fontFamily = fontFamilyMatch[1];

            // Extract text content
            const textContentMatch = textElem.match(/<text[^>]*>(.*?)<\/text>/s);
            if (textContentMatch) {
                const textContent = textContentMatch[1];

                // Convert <text> to <path>
                const pathElem = `<path fill="${fill}" d="M${x},${y} h${fontSize * textContent.length}" font-family="${fontFamily}">${textContent}</path>`;
                pathElems.push(pathElem);
            }
        }
    });

    return pathElems.join('');
}

const generateStatsCard = async (userData) => {
    try {
        // Create a base image
        const image = sharp({
            create: {
                width: 650,
                height: 275,
                channels: 4,
                background: { r: 23, g: 32, b: 42, alpha: 1 }
            }
        });

        // Prepare SVG text with embedded custom font
        const svgText = Buffer.from(`
            <svg width="650" height="275" xmlns="http://www.w3.org/2000/svg">
                <style>
                    @font-face {
                        font-family: 'MyCustomFont';
                        src: url('${path.resolve('public/fonts/LibreBaskerville-Regular.ttf')}') format('truetype');
                    }
                    text {
                        font-family: 'MyCustomFont', Arial, sans-serif;
                    }
                </style>
                <text x="325" y="40" text-anchor="middle" fill="#F7DC6F" font-size="20">
                    ${userData?.basicData?.username}'s GitHub Stats
                </text>
            </svg>
        `);

        // Prepare basic data SVG
        const basicDataSvg = Buffer.from(`<svg width="260" height="275" xmlns="http://www.w3.org/2000/svg">
            ${convertTextToPath(`
                <text x="20" y="80" fill="#FDFEFE" font-size="18">
                    Join When: ${userData?.basicData?.join_when}
                </text>
                <text x="20" y="110" fill="#FDFEFE" font-size="18">
                    Total Followers: ${userData?.basicData?.followers}
                </text>
                <text x="20" y="140" fill="#FDFEFE" font-size="18">
                    Total Repositories: ${userData?.basicData?.public_repos}
                </text>
                <text x="20" y="170" fill="#FDFEFE" font-size="18">
                    Total Repositories Latest: ${userData?.basicData?.repo_latest_total}
                </text>
            `)}
        </svg>`);

        // Calculate midpoint for splitting the languages array
        const midpoint = Math.ceil(userData?.languages?.length / 2);
        const languagesFirstRow = userData?.languages?.slice(0, midpoint);
        const languagesSecondRow = userData?.languages?.slice(midpoint);

        // Prepare languages SVG for the first row
        const languagesTextFirstRow = languagesFirstRow?.map((item, index) => `
            <circle cx="20" cy="${80 + index * 20}" r="5" fill="${languageColors[item?.language] || '#FFFFFF'}" />
            <text x="40" y="${85 + index * 20}" fill="#FDFEFE" font-size="14">
                ${item?.language}: ${((item.count / userData?.basicData?.public_repos) * 100).toFixed(2)}%
            </text>
        `).join('');

        const languagesSvgFirstRow = Buffer.from(`<svg width="325" height="275" xmlns="http://www.w3.org/2000/svg">
            ${convertTextToPath(languagesTextFirstRow)}
        </svg>`);

        // Prepare languages SVG for the second row
        const languagesTextSecondRow = languagesSecondRow?.map((item, index) => `
            <circle cx="20" cy="${80 + index * 20}" r="5" fill="${languageColors[item?.language] || '#FFFFFF'}" />
            <text x="40" y="${85 + index * 20}" fill="#FDFEFE" font-size="14">
                ${item.language}: ${((item.count / userData?.basicData?.public_repos) * 100).toFixed(2)}%
            </text>
        `).join('');

        const languagesSvgSecondRow = Buffer.from(`<svg width="325" height="275" xmlns="http://www.w3.org/2000/svg">
            ${convertTextToPath(languagesTextSecondRow)}
        </svg>`);

        // Prepare divider SVG
        const dividerSvg = Buffer.from(`<svg width="2" height="200" xmlns="http://www.w3.org/2000/svg">
            <line x1="1" y1="0" x2="1" y2="275" stroke="#FFFFFF" stroke-width="2"/>
        </svg>`);

        // Composite the SVGs over the base image
        const buffer = await image
            .composite([
                { input: svgText, top: 10, left: 0 },
                { input: basicDataSvg, top: 20, left: 10 },
                { input: dividerSvg, top: 70, left: 285 },
                { input: languagesSvgFirstRow, top: 15, left: 290 },
                { input: languagesSvgSecondRow, top: 15, left: 460 }
            ])
            .png()
            .toBuffer();

        return buffer;
    } catch (error) {
        console.error('Error generating stats card:', error);
        return false;
    }
};

module.exports = { generateStatsCard };