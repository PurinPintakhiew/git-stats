const fetch = require('node-fetch');
const { ConvertDays } = require('../libs/ConvertDay');

const getUserData = async (username, token) => {
    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                Authorization: `token ${token}`,
            },
        });

        if (!userResponse?.ok) {
            throw new Error(`Failed to fetch user data: ${userResponse?.statusText}`);
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

        return reposData;

        const languageCounts = reposData?.reduce((acc, repo) => {
            if (repo?.language) {
                acc[repo?.language] = (acc[repo?.language] || 0) + 1;
            }
            return acc;
        }, {});

        const languages = Object.entries(languageCounts)?.map(([language, count]) => ({ language, count }));

        const repoLatestTotal = reposData?.reduce((acc, repo) => {
            const nowDate = new Date();
            const repoDate = new Date(repo?.created_at);

            if (nowDate?.getFullYear() - repoDate?.getFullYear() === 0) {
                acc += 1;
            }
            return acc;
        }, 0);

        return {
            basicData: {
                username: userData?.login || "",
                followers: userData?.followers || 0,
                public_repos: userData?.public_repos || 0,
                repo_latest_total: repoLatestTotal || 0,
                join_when: ConvertDays(userData?.created_at) || "",
            },
            languages,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = { getUserData };
