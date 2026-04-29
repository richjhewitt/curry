// ─────────────────────────────────────────
//  CURRY CARAVAN — app.js (categories)
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
          <span class="stage-icon">${stage.icon}</span>
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

  const emoji = recipe.emoji || getEmoji(recipe.name);

  const stagesHTML = recipe.stages?.length
    ? buildStagesHTML(recipe.stages)
    : `<p style="color:var(--text-muted);font-size:0.85rem;">No stages yet.</p>`;

  const notesHTML = recipe.notes?.length
    ? `<div class="recipe-notes">
         <h4>Notes</h4>
         <ul>${recipe.notes.map(n => `<li>${n}</li>`).join("")}</ul>
       </div>`
    : "";

  card.innerHTML = `
    <div class="recipe-header">
      <div class="recipe-emoji">${emoji}</div>
      <div class="recipe-meta">
        <p class="recipe-name">${recipe.name}</p>
        <p class="recipe-desc">${recipe.description || ""}</p>
      </div>
      <div class="recipe-right">
        <span class="ninja-badge">⚡ ${recipe.cook_time || "?"}</span>
        <span class="recipe-chevron">▼</span>
      </div>
    </div>
    <div class="recipe-details">
      <div class="stages">${stagesHTML}</div>
      ${notesHTML}
    </div>
  `;

  card.addEventListener("click", () => {
    card.classList.toggle("open");
  });

  return card;
}

// INIT
fetch("recipes.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("recipes");
    const countEl   = document.getElementById("recipes-count");

    const categories = data.categories || [];
    let total = 0;

    categories.forEach((category, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "category";

      if (index === 0) wrapper.classList.add("open");

      const header = document.createElement("div");
      header.className = "category-header";
      header.innerHTML = `
        <span>${category.name}</span>
        <span class="category-chevron">▼</span>
      `;

      const list = document.createElement("div");
      list.className = "category-list";

      (category.recipes || []).forEach(recipe => {
        total++;
        list.appendChild(buildCard(recipe));
      });

      header.addEventListener("click", () => {
        wrapper.classList.toggle("open");
      });

      wrapper.appendChild(header);
      wrapper.appendChild(list);
      container.appendChild(wrapper);
    });

    countEl.textContent = `${total} recipe${total !== 1 ? "s" : ""}`;
  });