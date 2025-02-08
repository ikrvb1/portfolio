import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

renderProjects(projects, projectsContainer, 'h2');

if (projects && Array.isArray(projects)) {
  document.title = `${projects.length} Projects`;
  const projectsTitle = document.querySelector('.projects-title');
  if (projectsTitle) {
    projectsTitle.textContent = `${projects.length} Projects`;
  }
}

function renderPieChart(projectsGiven) {
  d3.select('svg').selectAll('*').remove();
  d3.select('.legend').selectAll('*').remove();

  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  let data = rolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));

  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

  let arcData = sliceGenerator(data);
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let svg = d3.select('svg');

  arcData.forEach((d, idx) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(idx));
  });

  let legend = d3.select('.legend');
  data.forEach((d, idx) => {
    legend.append('li')
          .attr('style', `--color:${colors(idx)}`)
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
  let query = event.target.value.toLowerCase();

  let filteredProjects = projects.filter((project) => {
    return Object.values(project).join(' ').toLowerCase().includes(query);
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});
