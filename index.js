import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

const projectsContainer = document.querySelector('.projects');

fetchJSON('./lib/projects.json').then(projects => {
    renderProjects(projects.slice(0, 3), projectsContainer, 'h2');
});

const profileStats = document.querySelector('#profile-stats');

async function displayGitHubStats(username) {
    try {
        const githubData = await fetchGitHubData(username);

        if (profileStats) {
            profileStats.innerHTML = `
                <dl>
                  <dt>Followers</dt><dd>${githubData.followers}</dd>
                  <dt>Following</dt><dd>${githubData.following}</dd>
                  <dt>Public Repos</dt><dd>${githubData.public_repos}</dd>
                  <dt>Public Gists</dt><dd>${githubData.public_gists}</dd>
                  </dl>
            `;
        }
    } catch (error) {
        console.error("Error fetching GitHub data:", error);
        profileStats.innerHTML = "<p>Failed to load GitHub stats.</p>";
    }
}

displayGitHubStats('ikrvb1');