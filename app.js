// ─────────────────────────────────────────
//  CURRY CARAVAN — app.js
// ─────────────────────────────────────────

// Emoji assigned by recipe name keywords — extend as needed
const RECIPE_EMOJI = {
  pasta:    "🍝",
  chicken:  "🍗",
  lamb:     "🥩",
  lentil:   "🫘",
  dal:      "🫘",
  dhal:     "🫘",
  potato:   "🥔",
  aloo:     "🥔",
  paneer:   "🧀",
  fish:     "🐟",
  prawn:    "🦐",
  rice:     "🍚",
  biryani:  "🍚",
  veg:      "🥦",
  mushroom: "🍄",
  egg:      "🥚",
  default:  "🥘"
};

function getEmoji(name) {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(RECIPE_EMOJI)) {
    if (key !== "default" && lower.includes(key)) return emoji;
  }
  return RECIPE_EMOJI.default;
}

function buildCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe";
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-expanded", "false");

  const cookTime = recipe.cook_time || "5 min";
  const emoji    = recipe.emoji || getEmoji(recipe.name);

  // Ingredients HTML
  const ingredientItems = (recipe.ingredients || [])
    .map(i => `<li>${i}</li>`)
    .join("");

  // Method HTML
  const methodItems = (recipe.method || [])
    .map(s => `<li>${s}</li>`)
    .join("");

  // Notes HTML (only rendered if present)
  const notesHTML = recipe.notes && recipe.notes.length
    ? `<div class="recipe-notes">
         <h4>Notes</h4>
         <ul>${recipe.notes.map(n => `<li>${n}</li>`).join("")}</ul>
       </div>`
    : "";

  card.innerHTML = `
    <div class="recipe-header">
      <div class="recipe-emoji" aria-hidden="true">${emoji}</div>
      <div class="recipe-meta">
        <p class="recipe-name">${recipe.name}</p>
        <p class="recipe-base">${recipe.base}</p>
      </div>
      <div class="recipe-right">
        <span class="ninja-badge">⚡ Foodi · ${cookTime}</span>
        <span class="recipe-chevron" aria-hidden="true">▼</span>
      </div>
    </div>
    <div class="recipe-details" aria-hidden="true">
      <div class="detail-grid">
        <div class="detail-section">
          <h4>Ingredients</h4>
          <ul>${ingredientItems}</ul>
        </div>
        <div class="detail-section">
          <h4>Method</h4>
          <ol>${methodItems}</ol>
        </div>
      </div>
      ${notesHTML}
    </div>
  `;

  // Toggle open/closed
  function toggle() {
    const isOpen = card.classList.toggle("open");
    card.setAttribute("aria-expanded", String(isOpen));
    card.querySelector(".recipe-details")
        .setAttribute("aria-hidden", String(!isOpen));
  }

  card.addEventListener("click", toggle);
  card.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });

  return card;
}

// ── INIT ──────────────────────────────────
fetch("recipes.json")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    const container = document.getElementById("recipes");
    const countEl   = document.getElementById("recipes-count");
    const recipes   = data.recipes || [];

    const count = recipes.length;
    countEl.textContent = `${count} recipe${count !== 1 ? "s" : ""}`;

    if (count === 0) {
      container.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;">
        No recipes yet — add some to recipes.json
      </p>`;
      return;
    }

    // Stagger card appearances
    recipes.forEach((recipe, i) => {
      const card = buildCard(recipe);
      card.style.opacity = "0";
      card.style.transform = "translateY(10px)";
      card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      container.appendChild(card);

      requestAnimationFrame(() => {
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, i * 60);
      });
    });
  })
  .catch(err => {
    console.error("Failed to load recipes:", err);
    document.getElementById("recipes-count").textContent = "Couldn't load recipes";
    document.getElementById("recipes").innerHTML = `
      <p style="color:var(--text-muted);font-size:0.9rem;">
        Make sure recipes.json is in the same folder as this page.
      </p>`;
  });
