fetch("recipes.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("recipes");

    data.recipes.forEach(recipe => {
      const div = document.createElement("div");
      div.className = "recipe";

      div.innerHTML = `
        <h3>${recipe.name}</h3>
        <p>${recipe.base}</p>
        <div class="recipe-details" style="display:none;"></div>
      `;

      const details = div.querySelector(".recipe-details");

      div.addEventListener("click", () => {
        const isOpen = details.style.display === "block";

        if (isOpen) {
          details.style.display = "none";
          details.innerHTML = "";
        } else {
          const ingredients = recipe.ingredients.map(i => `<li>${i}</li>`).join("");
          const method = recipe.method.map(s => `<li>${s}</li>`).join("");
          const notes = recipe.notes
            ? `<h4>Notes</h4><ul>${recipe.notes.map(n => `<li>${n}</li>`).join("")}</ul>`
            : "";

          details.innerHTML = `
            <h4>Ingredients</h4>
            <ul>${ingredients}</ul>

            <h4>Method</h4>
            <ol>${method}</ol>

            ${notes}
          `;

          details.style.display = "block";
        }
      });

      container.appendChild(div);
    });
  });