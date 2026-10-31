/**
 * ToolNest Phase 1 — legacy app bridge.
 *
 * Connects the new #/tools/:slug router to the existing tool workspace
 * without replacing the current tool implementations or card rendering.
 */
import { initRouter } from "./router.js?v=20261031-retire-tools1";

function startRouterBridge() {
  initRouter((route) => {
    if (route.name === "tool" && route.tool) {
      const openTool = window.openTool;
      if (typeof openTool === "function") {
        openTool(route.tool.id, false);
      } else {
        console.error("ToolNest router: the existing tool workspace is not ready.");
      }
      return;
    }

    if (route.name === "not-found") {
      const legacy = window.location.hash.match(/^#tool\/([a-z0-9]+)$/i);
      if (legacy && typeof window.openTool === "function") {
        window.openTool(legacy[1], false);
      } else {
        window.showToolNotFound?.(route.slug || window.location.hash.replace(/^#/, ""));
      }
      return;
    }

    if (route.name === "error") {
      window.showToolNotFound?.("route");
      console.error("ToolNest router could not resolve this route.", route.error);
      return;
    }

    if (route.name === "home" && document.body.classList.contains("tool-open")) {
      document.getElementById("closeWorkspace")?.click();
    }
  });
}

// DOMContentLoaded ensures the existing deferred app.js has executed first.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startRouterBridge, { once: true });
} else {
  startRouterBridge();
}
