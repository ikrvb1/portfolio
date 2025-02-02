import { fetchJSON, renderProjects } from './global.js';

const projectsContainer = document.querySelector('.projects');

fetchJSON('./lib/projects.json').then(projects => {
    renderProjects(projects.slice(0, 3), projectsContainer, 'h2');
});