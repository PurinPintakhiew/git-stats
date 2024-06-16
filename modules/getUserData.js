const fetch = require('node-fetch');
const { ConvertDays } = require('../libs/ConvertDay');

const getUserData = async (username) => {
    try {
        if (!username) {
            throw new Error('Username is missing');
        }

        const userResponse = await fetch(`https://api.github.com/users/${username}`);

        if (!userResponse?.ok) {
            throw new Error(`Failed to fetch user data: ${userResponse?.statusText}`);
        }

        const userData = await userResponse?.json();

        if (!userData?.repos_url) {
            throw new Error(`Repos URL not found for user: ${username}`);
        }

        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);

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

        const languages = Object.entries(languageCounts)?.map(([language, count]) => ({ language, count }))?.sort((acc, curr) => curr?.count - acc?.count);

        const repoLatestTotal = reposData?.reduce((acc, repo) => {
            const nowDate = new Date();
            const repoDate = new Date(repo?.created_at);

            if (nowDate.getFullYear() - repoDate.getFullYear() === 0) {
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
        console.error('Error fetching user data:', error.message);
        return null;
    }
}

module.exports = { getUserData };
