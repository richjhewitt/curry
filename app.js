// ─────────────────────────────────────────
//  CURRY CARAVAN — app.js
// ─────────────────────────────────────────

const RECIPE_EMOJI = {
  pasta:    "🍝",
  lentil:   "🫘",
  dal:      "🫘",
  dhal:     "🫘",
  potato:   "🥔",
  aloo:     "🥔",
  paneer:   "🧀",
  tofu:     "🍱",
  spinach:  "🥬",
  saag:     "🥬",
  rice:     "🍚",
  biryani:  "🍚",
  veg:      "🥦",
  chickpea: "🫘",
  chana:    "🫘",
  soup:     "🍲",
  default:  "🥘"
};

function getEmoji(name) {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(RECIPE_EMOJI)) {
    if (key !== "default" && lower.includes(key)) return emoji;
  }
  return RECIPE_EMOJI.default;
}

function buildStagesHTML(stages) {
  return stages.map((stage, index) => {
    const isList = stage.name === "Ingredient gathering";
    const tag    = isList ? "ul" : "ol";
    const items  = stage.steps.map(s => `<li>${s}</li>`).join("");

    return `
      <div class="stage">
        <div class="stage-header">
          <span class="stage-icon" aria-hidden="true">${stage.icon}</span>
          <span class="stage-num">${index + 1}</span>
          <span class="stage-name">${stage.name}</span>
        </div>
        <${tag} class="stage-steps">${items}</${tag}>
      </div>
    `;
  }).join("");
}

function buildCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe";
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-expanded", "false");

  const cookTime = recipe.cook_time || "5 min";
  const emoji    = recipe.emoji    || getEmoji(recipe.name);
  const tags     = (recipe.tags    || []).map(t => `<span class="tag">${t}</span>`).join("");

  const stagesHTML = recipe.stages
    ? buildStagesHTML(recipe.stages)
    : `<p style="color:var(--text-muted);font-size:0.85rem;">No stages found.</p>`;

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
        <p class="recipe-desc">${recipe.description || ""}</p>
        <div class="recipe-tags">${tags}</div>
      </div>
      <div class="recipe-right">
        <span class="ninja-badge">⚡ ${cookTime}</span>
        <span class="recipe-chevron" aria-hidden="true">▼</span>
      </div>
    </div>
    <div class="recipe-details" aria-hidden="true">
      <div class="stages">
        ${stagesHTML}
      </div>
      ${notesHTML}
    </div>
  `;

  function toggle() {
    const isOpen = card.classList.toggle("open");
    card.setAttribute("aria-expanded", String(isOpen));
    card.querySelector(".recipe-details")
        .setAttribute("aria-hidden", String(!isOpen));
  }

  card.addEventListener("click", e => {
    // Don't toggle if clicking a link inside the card
    if (e.target.tagName === "A") return;
    toggle();
  });

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
    const count     = recipes.length;

    countEl.textContent = `${count} recipe${count !== 1 ? "s" : ""}`;

    if (count === 0) {
      container.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;padding:1rem 0;">
        No recipes yet — add some to recipes.json
      </p>`;
      return;
    }

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
        }, i * 70);
      });
    });
  })
  .catch(err => {
    console.error("Failed to load recipes:", err);
    document.getElementById("recipes-count").textContent = "Couldn't load recipes";
    document.getElementById("recipes").innerHTML = `
      <p style="color:var(--text-muted);font-size:0.9rem;padding:1rem 0;">
        Make sure recipes.json is in the same folder as this page.
      </p>`;
  });
