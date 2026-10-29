/**
 * ToolNest Phase 1 — legacy app bridge.
 *
 * Connects the new #/tools/:slug router to the existing tool workspace
 * without replacing the current tool implementations or card rendering.
 */
import { initRouter } from "./router.js";

function startRouterBridge() {
  initRouter((route) => {
    if (route.name === "tool" && route.tool) {
      const openTool = window.openTool;
      if (typeof openTool === "function") {
        openTool(route.tool.id, false);
      } else {
        console.error("ToolNest router: the existing tool workspace is not ready.");
      }
    }
  });
}

// DOMContentLoaded ensures the existing deferred app.js has executed first.
if (document.readyState === "loading" || document.readyState === "interactive") {
  // Deferred classic scripts are guaranteed to run before DOMContentLoaded.
  // Waiting while the document is interactive prevents the module bridge from
  // resolving a direct modern route before app.js exposes window.openTool.
  document.addEventListener("DOMContentLoaded", startRouterBridge, { once: true });
} else {
  startRouterBridge();
}
