/* Phase 2: autocomplete, category dropdown and keyboard shortcuts.
   Existing app.js remains the source of truth for filtering and tool launching. */
(() => {
  const input = document.getElementById("toolSearch");
  const suggestions = document.getElementById("searchSuggestions");
  const grid = document.getElementById("toolGrid");
  if (!input || !suggestions || !grid) return;

  const closeSuggestions = () => {
    suggestions.classList.add("hidden");
    suggestions.replaceChildren();
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  };

  const showSuggestions = () => {
    const query = input.value.trim().toLowerCase();
    suggestions.replaceChildren();
    if (!query) {
      closeSuggestions();
      return;
    }

    const cards = [...grid.querySelectorAll(".tool-card")].slice(0, 7);
    if (!cards.length) {
      const empty = document.createElement("div");
      empty.className = "search-empty";
      empty.textContent = "No matching tools found. Try another keyword.";
      suggestions.append(empty);
      suggestions.classList.remove("hidden");
      input.setAttribute("aria-expanded", "true");
      return;
    }

    cards.forEach((card, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.id = "search-option-" + index;
      button.className = "search-suggestion";
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", "false");
      const icon = document.createElement("span");
      icon.className = "search-suggestion-icon";
      icon.setAttribute("aria-hidden", "true");
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
    });
    suggestions.classList.remove("hidden");
    input.setAttribute("aria-expanded", "true");
  };

  const moveFocus = (direction) => {
    const options = [...suggestions.querySelectorAll(".search-suggestion")];
    if (!options.length || suggestions.classList.contains("hidden")) return;
    const current = options.indexOf(document.activeElement);
    const next = current < 0
      ? (direction > 0 ? 0 : options.length - 1)
      : (current + direction + options.length) % options.length;
    options.forEach((option, index) => option.setAttribute("aria-selected", String(index === next)));
    options[next].focus();
  };

  input.addEventListener("input", showSuggestions);
  input.addEventListener("focus", showSuggestions);
  input.addEventListener("keydown", event => {
    if (event.key === "Escape") closeSuggestions();
    if (event.key === "ArrowDown" && !suggestions.classList.contains("hidden")) {
      event.preventDefault();
      moveFocus(1);
    }
    if (event.key === "ArrowUp" && !suggestions.classList.contains("hidden")) {
      event.preventDefault();
      moveFocus(-1);
    }
    if (event.key === "Enter") {
      const first = suggestions.querySelector(".search-suggestion");
      if (first && !suggestions.classList.contains("hidden")) {
        event.preventDefault();
        first.click();
      }
    }
  });

  suggestions.addEventListener("keydown", event => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(event.key === "ArrowDown" ? 1 : -1);
    }
    if (event.key === "Escape") {
      closeSuggestions();
      input.focus();
    }
  });

  document.addEventListener("keydown", event => {
    const target = event.target;
    const typing = target instanceof HTMLElement &&
      (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    if (event.key === "/" && !typing && !document.body.classList.contains("tool-open") && !event.ctrlKey && !event.metaKey && !event.altKey) {
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