const repoGrid = document.getElementById("repo-grid");

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function repoCard(repo) {
  const language = repo.language || "Multi";
  const stars = repo.stargazers_count || 0;

  return `
    <article class="card">
      <a class="repo-link" href="${repo.html_url}" target="_blank" rel="noreferrer">
        <h3 class="repo-name">${repo.name}</h3>
      </a>
      <p class="repo-desc">${repo.description || "No description provided."}</p>
      <div class="repo-meta">
        <span>${language}</span>
        <span>★ ${stars}</span>
        <span>Updated ${formatDate(repo.updated_at)}</span>
      </div>
    </article>
  `;
}

async function loadRepos() {
  if (!repoGrid) return;

  repoGrid.innerHTML = '<p class="card-meta">Loading repositories...</p>';

  try {
    const response = await fetch(
      "https://api.github.com/users/NIRMALRAJA2206/repos?sort=updated&per_page=8"
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = await response.json();
    const visible = repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    if (!visible.length) {
      repoGrid.innerHTML =
        '<p class="card-meta">No public repositories available yet.</p>';
      return;
    }

    repoGrid.innerHTML = visible.map(repoCard).join("");
  } catch (error) {
    repoGrid.innerHTML =
      '<p class="card-meta">Unable to load GitHub projects right now. Visit the GitHub profile link above.</p>';
    console.error(error);
  }
}

loadRepos();
