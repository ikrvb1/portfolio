console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/ikrvb1', title: 'GitHub' }
 ];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
  }

  document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
        Theme:
        <select>
          <option value="light dark">Automatic</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>`
  );

const select = document.querySelector('.color-scheme select');

 select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
});

window.addEventListener('load', () => {
    if (localStorage.colorScheme) {
      document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
      select.value = localStorage.colorScheme;
    }
  });
  
export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!projects || !Array.isArray(projects)) {
    console.error('Invalid projects data:', projects);
    return;
  }
  if (!containerElement) {
    console.error('Invalid container element:', containerElement);
    return;
  }

  containerElement.innerHTML = '';
  projects.forEach(project => {
    if (!project || typeof project !== 'object') {
      console.error('Invalid project:', project);
      return;
    }
    const article = document.createElement('article');
    article.innerHTML = `
    <h3>${project.title}</h3>
    <img src="${project.image}" alt="${project.title}">
    <p>${project.description}</p>
    <div class = "project-year">C. ${project.year}</div>`;
    containerElement.appendChild(article);
  });
}

export async function fetchGitHubData(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  return response.json();
}