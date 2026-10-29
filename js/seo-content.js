/* Phase 6: per-tool SEO guide, features, FAQs and FAQPage JSON-LD. */
(() => {
  "use strict";

  const workspace = document.getElementById("workspace");
  const toolPanel = document.getElementById("toolPanel");
  const toolMessage = document.getElementById("toolMessage");
  if (!workspace || !toolPanel || !toolMessage) return;

  const section = document.createElement("section");
  section.id = "toolSeoContent";
  section.className = "tool-seo-content";
  section.setAttribute("aria-label", "Tool guide and frequently asked questions");
  toolMessage.insertAdjacentElement("afterend", section);

  let toolMetadata = [];
  let renderedToolId = "";
  let renderQueued = false;

  const schemaNode = document.createElement("script");
  schemaNode.type = "application/ld+json";
  schemaNode.id = "toolFaqSchema";
  document.head.appendChild(schemaNode);

  function currentToolId() {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash.startsWith("tool/")) return hash.slice(5);
    const slugMatch = hash.match(/^\/tools\/([a-z0-9-]+)\/?$/i);
    if (slugMatch) {
      const slug = slugMatch[1].toLowerCase();
      return toolMetadata.find((item) => item.slug.toLowerCase() === slug)?.id || "";
    }
    const title = document.getElementById("workspaceTitle")?.textContent.trim();
    return toolMetadata.find((item) => item.title === title)?.id || "";
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function renderList(title, values, className) {
    if (!Array.isArray(values) || values.length === 0) return null;
    const block = makeElement("div", "tool-seo-block");
    block.appendChild(makeElement("h2", "tool-seo-heading", title));
    const list = makeElement("ul", className);
    values.forEach((value) => list.appendChild(makeElement("li", "", value)));
    block.appendChild(list);
    return block;
  }

  function clearSchema() {
    schemaNode.textContent = "";
    schemaNode.removeAttribute("data-tool-id");
  }

  function render(tool) {
    if (!tool?.seo || !Array.isArray(tool.seo.faqs)) {
      section.replaceChildren();
      section.hidden = true;
      clearSchema();
      renderedToolId = tool?.id || "";
      return;
    }

    if (renderedToolId === tool.id) return;
    renderedToolId = tool.id;
    section.replaceChildren();
    section.hidden = false;
    section.dataset.toolId = tool.id;

    const intro = makeElement("p", "tool-seo-intro", tool.seo.description || tool.description || "");
    section.appendChild(intro);

    const howTo = makeElement("div", "tool-seo-block");
    howTo.appendChild(makeElement("h2", "tool-seo-heading", `How to Use ${tool.title}?`));
    const steps = makeElement("ol", "tool-seo-steps");
    (tool.seo.steps || []).forEach((step) => steps.appendChild(makeElement("li", "", step)));
    howTo.appendChild(steps);
    section.appendChild(howTo);

    const features = renderList("Key Features & Benefits", tool.seo.features, "tool-seo-features");
    if (features) section.appendChild(features);

    if (tool.seo.faqs.length) {
      const faqBlock = makeElement("div", "tool-seo-block tool-seo-faq");
      faqBlock.appendChild(makeElement("h2", "tool-seo-heading", "Frequently Asked Questions"));
      const accordion = makeElement("div", "tool-seo-accordion");
      tool.seo.faqs.forEach((faq, index) => {
        if (!faq?.question || !faq?.answer) return;
        const details = document.createElement("details");
        details.className = "tool-seo-faq-item";
        if (index === 0) details.open = true;
        const summary = makeElement("summary", "", faq.question);
        const answer = makeElement("div", "tool-seo-answer");
        answer.appendChild(makeElement("p", "", faq.answer));
        details.append(summary, answer);
        accordion.appendChild(details);
      });
      faqBlock.appendChild(accordion);
      section.appendChild(faqBlock);
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": tool.seo.faqs
        .filter((faq) => faq?.question && faq?.answer)
        .map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
    };
    schemaNode.textContent = JSON.stringify(schema).replace(/</g, "\\u003c");
    schemaNode.dataset.toolId = tool.id;
  }

  function scheduleRender() {
    if (renderQueued) return;
    renderQueued = true;
    window.requestAnimationFrame(() => {
      renderQueued = false;
      if (workspace.classList.contains("hidden") || !document.body.classList.contains("tool-open")) {
        section.hidden = true;
        clearSchema();
        renderedToolId = "";
        return;
      }
      const id = currentToolId();
      const tool = toolMetadata.find((item) => item.id === id);
      if (tool) render(tool);
      else {
        section.replaceChildren();
        section.hidden = true;
        section.removeAttribute("data-tool-id");
        clearSchema();
        renderedToolId = "";
      }
    });
  }

  fetch(new URL("./tools-data.json", document.currentScript.src))
    .then((response) => {
      if (!response.ok) throw new Error(`SEO metadata request failed: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) throw new TypeError("SEO metadata must be an array.");
      toolMetadata = data;
      scheduleRender();
    })
    .catch((error) => console.warn("ToolNest: SEO content could not be loaded.", error));

  const observer = new MutationObserver(scheduleRender);
  observer.observe(workspace, { attributes: true, attributeFilter: ["class"] });
  observer.observe(toolPanel, { childList: true });
  window.addEventListener("hashchange", scheduleRender);
  window.addEventListener("popstate", scheduleRender);
})();
