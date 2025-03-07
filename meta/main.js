let data = [];
let commits = [];

async function loadData() {
  data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line), // or just +row.line
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));

  displayStats(); // Call displayStats instead of processCommits
  updateScales(); // Update scales after loading data
  createScatterplot(); // Create scatterplot after updating scales
  console.log(commits);
  console.log(data);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
});

function processCommits() {
  commits = d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        url: 'https://github.com/vis-society/lab-7/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
        configurable: false,
        writable: false,
        enumerable: true
      });

      return ret;
    });
}

function displayStats() {
  // Process commits first
  processCommits();

  // Create the dl element
  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  // Add total LOC
  dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
  dl.append('dd').text(data.length);

  // Add total commits
  dl.append('dt').text('Commits');
  dl.append('dd').text(commits.length);

  // Additional stats
  const numFiles = d3.groups(data, (d) => d.file).length;
  dl.append('dt').text('Num Files');
  dl.append('dd').text(numFiles);

  const maxFileLength = d3.max(data, (d) => d.length);
  dl.append('dt').text('Max File Length');
  dl.append('dd').text(maxFileLength);

  const workByPeriod = d3.rollups(
    data,
    (v) => v.length,
    (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
  );
  const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];

  dl.append('dt').text('Most active time period');
  dl.append('dd').text(maxPeriod);
}

const width = 1000;
const height = 600;

const svg = d3
  .select('#chart')
  .append('svg')
  .attr('viewBox', `0 0 ${width} ${height}`)
  .style('overflow', 'visible');

const xScale = d3.scaleTime().range([0, width]).nice();
const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

function updateScales() {
  xScale.domain(d3.extent(commits, (d) => d.datetime));
}

function drawCircles() {
  const dots = svg.append('g').attr('class', 'dots');

  dots
    .selectAll('circle')
    .data(commits)
    .join('circle')
    .attr('cx', (d) => xScale(d.datetime))
    .attr('cy', (d) => yScale(d.hourFrac))
    .attr('r', 5)
    .attr('fill', 'steelblue');
}

function createScatterplot() {
    // Define margins and usable area
    const margin = { top: 10, right: 10, bottom: 30, left: 20 };
    const usableArea = {
      top: margin.top,
      right: width - margin.right,
      bottom: height - margin.bottom,
      left: margin.left,
      width: width - margin.left - margin.right,
      height: height - margin.top - margin.bottom,
    };
  
    // Update scales with the new ranges
    xScale.range([usableArea.left, usableArea.right]);
    yScale.range([usableArea.bottom, usableArea.top]);
  
    // Add gridlines BEFORE the axes
const gridlines = svg.append('g')
.attr('class', 'gridlines')
.attr('transform', `translate(${usableArea.left}, 0)`);

// Create gridlines as an axis with no labels and full-width ticks
gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

// Style the gridlines to make them lighter
gridlines.selectAll('line')
.attr('stroke', '#ccc')       // Lighter gray color
.attr('stroke-opacity', 0.5)  // Make them slightly transparent
.attr('stroke-width', 1);     // Thin lines for the grid

    // Create the axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
      .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');
  
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0, ${usableArea.bottom})`)
      .call(xAxis);
  
    // Add Y axis
    svg.append('g')
      .attr('transform', `translate(${usableArea.left}, 0)`)
      .call(yAxis);
  
    // Draw circles for the scatterplot
    const dots = svg.append('g').attr('class', 'dots');
    dots.selectAll('circle')
      .data(commits)
      .join('circle')
      .attr('cx', (d) => xScale(d.datetime))
      .attr('cy', (d) => yScale(d.hourFrac))
      .attr('r', 5)
      .attr('fill', 'steelblue');
  }
