const fetch = require('node-fetch');

async function getUserData(username, token) {
    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                Authorization: `token ${token}`,
            },
        });

        if (!userResponse?.ok) {
            throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
        }

        const userData = await userResponse?.json();

        if (!userData?.repos_url) {
            throw new Error(`Repos URL not found for user: ${username}`);
        }

        const reposResponse = await fetch(userData?.repos_url, {
            headers: {
                Authorization: `token ${token}`,
            },
        });

        if (!reposResponse?.ok) {
            throw new Error(`Failed to fetch repositories: ${reposResponse?.statusText}`);
        }

        const reposData = await reposResponse?.json();

        const languageCounts = reposData?.reduce((acc, repo) => {
            if (repo?.language) {
                acc[repo?.language] = (acc[repo?.language] || 0) + 1;
            }
            return acc;
        }, {});

        const languages = Object.entries(languageCounts)?.map(([language, count]) => ({ language, count }));

        return {
            basicData: {
                username: userData?.login || "",
                followers: userData?.followers || "",
                public_repos: userData?.public_repos || "",
            },
            languages,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = { getUserData };
