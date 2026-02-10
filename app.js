document.getElementById('year').textContent = new Date().getFullYear();

// OPTIONAL: Auto-load public repos into the project grid.
// Replace YOUR_USERNAME and keep a "featured" list so you control what shows.
const USERNAME = "lkomenski";
const FEATURED = new Set([
  "MyGuitarShop",
  "event-log-analyzer",
  "labor-market-dashboard",
]);

async function loadFeaturedRepos() {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;

  try {
    const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`);
    if (!res.ok) return;

    const repos = await res.json();
    const featured = repos.filter(r => FEATURED.has(r.name));

    // If you want ONLY your handcrafted cards, comment out the next two lines:
    // grid.innerHTML = "";
    // featured.forEach(r => grid.appendChild(repoCard(r)));
  } catch (e) {
    // Silent fail: portfolio should still look good even if API calls fail.
  }
}

function repoCard(repo) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <div class="card-top">
      <h3>${escapeHtml(repo.name)}</h3>
      <span class="tag">GitHub Repo</span>
    </div>
    <p>${escapeHtml(repo.description || "Project repository.")}</p>
    <div class="chips">
      ${repo.language ? `<span>${escapeHtml(repo.language)}</span>` : ""}
      <span>Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
    </div>
    <div class="card-actions">
      <a class="btn sm" href="${repo.html_url}" target="_blank" rel="noreferrer">Code</a>
    </div>
  `;
  return el;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[s]));
}

loadFeaturedRepos();
