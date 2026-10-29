/* Phase 2: autocomplete, category dropdown and slash shortcut.
   Existing app.js remains the source of truth for tool filtering and launching. */
(() => {
  const input = document.getElementById("toolSearch");
  const suggestions = document.getElementById("searchSuggestions");
  const grid = document.getElementById("toolGrid");
  if (!input || !suggestions || !grid) return;

  const closeSuggestions = () => {
    suggestions.classList.add("hidden");
    suggestions.replaceChildren();
  };

  const showSuggestions = () => {
    const query = input.value.trim().toLowerCase();
    suggestions.replaceChildren();
    if (!query) {
      closeSuggestions();
      return;
    }

    const cards = [...grid.querySelectorAll(".tool-card")];
    const matches = cards.slice(0, 7);
    if (!matches.length) {
      const empty = document.createElement("div");
      empty.className = "search-empty";
      empty.textContent = "No matching tools found. Try another keyword.";
      suggestions.append(empty);
      suggestions.classList.remove("hidden");
      return;
    }

    for (const card of matches) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "search-suggestion";
      const icon = document.createElement("span");
      icon.className = "search-suggestion-icon";
      icon.textContent = card.querySelector(".iconbox")?.textContent?.trim() || "↗";
      const copy = document.createElement("span");
      const title = document.createElement("span");
      title.className = "font-bold";
      title.textContent = card.querySelector("h3")?.textContent?.trim() || "Open tool";
      const meta = document.createElement("small");
      meta.textContent = card.querySelector(".category")?.textContent?.trim() || "Tool";
      copy.append(title, meta);
      button.append(icon, copy);
      button.addEventListener("click", () => {
        card.click();
        closeSuggestions();
      });
      suggestions.append(button);
    }
    suggestions.classList.remove("hidden");
  };

  input.addEventListener("input", showSuggestions);
  input.addEventListener("focus", showSuggestions);
  input.addEventListener("keydown", event => {
    if (event.key === "Escape") closeSuggestions();
    if (event.key === "Enter") {
      const first = suggestions.querySelector(".search-suggestion");
      if (first && !suggestions.classList.contains("hidden")) {
        event.preventDefault();
        first.click();
      }
    }
  });

  document.addEventListener("keydown", event => {
    const target = event.target;
    const typing = target instanceof HTMLElement &&
      (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    if (event.key === "/" && !typing && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      input.focus();
    }
    if (event.key === "Escape") closeSuggestions();
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".hero-search-area")) closeSuggestions();
    const categoryButton = event.target.closest("[data-nav-category]");
    if (categoryButton) {
      const category = categoryButton.dataset.navCategory;
      const chip = document.querySelector('#categoryFilters [data-category="' + CSS.escape(category) + '"]');
      if (chip) chip.click();
      const menu = categoryButton.closest("details");
      if (menu) menu.open = false;
      document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
})();