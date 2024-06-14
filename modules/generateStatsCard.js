const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

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
    let browser = null;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });
        console.log('Browser launched.');

        const page = await browser.newPage();
        console.log('New page created.');

        const content = `
            <html>
            <head>
                <style>
                    body {
                        width: 650px;
                        height: 275px;
                        background-color: #17202A;
                        color: white;
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    .header {
                        color: #F7DC6F;
                        font-size: 22px;
                        margin-bottom: 10px;
                        text-align: center;
                    }
                    .basic-data {
                        border-right: 2px solid white;
                    }
                    .basic-data, .languages {
                        margin-top: 20px;
                        font-size: 18px;
                    }
                    .languages {
                        margin-top: 20px;
                        font-size: 14px
                    }
                    .language {
                        display: flex;
                        align-items: center;
                        margin-bottom: 5px;
                    }
                    .dot {
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        margin-right: 10px;
                    }
                    .flex-row {
                        display: flex;
                        flex-direction: row;
                    }
                    .flex-row-justify-between {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }
                    .w-40 {
                        width: 40%
                    }
                    .w-50 {
                        width: 50%
                    }
                    .w-60 {
                        width: 60%
                    }
                    .flex-wrap {
                        flex-wrap: wrap;
                    }
                    .gap {
                        gap: 1em;
                    }
                </style>
            </head>
            <body>
                <div class="header">⭐️ ${userData?.basicData?.username}'s GitHub Stats</div>
                <div class="flex-row gap">
                    <div class="basic-data w-40">
                        <div>Join When: ${userData?.basicData?.join_when}</div>
                        <div>Total Followers: ${userData?.basicData?.followers}</div>
                        <div>Total Repositories: ${userData?.basicData?.public_repos}</div>
                        <div>Total Repositories Latest: ${userData?.basicData?.repo_latest_total}</div>
                    </div>
                    <div class="languages w-60 flex-row-justify-between flex-wrap">
                        ${userData?.languages?.map(language => `
                            <div class="language w-50">
                                <div class="dot" style="background-color: ${languageColors[language.language] || '#FFFFFF'};"></div>
                                <div>${language?.language}: ${((language?.count / userData?.basicData?.public_repos) * 100)?.toFixed(2)}%</div>
                            </div>
                        `)?.join('')}
                    </div>
                </div>
            </body>
            </html>
        `;

        console.log('Setting content...');
        await page.setContent(content);
        console.log('Content set.');

        const buffer = await page.screenshot({ type: 'png' });
        console.log('Screenshot taken.');

        return buffer;
    } catch (error) {
        console.error('Error generating stats card:', error);
        return false;
    } finally {
        if (browser) {
            await browser.close();
            console.log('Browser closed.');
        }
    }
}

module.exports = { generateStatsCard };
