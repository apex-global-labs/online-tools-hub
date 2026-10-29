/**
 * ToolNest Phase 1 — legacy app bridge.
 *
 * Connects the new #/tools/:slug router to the existing tool workspace
 * without replacing the current tool implementations or card rendering.
 */
import { initRouter } from "./router.js";

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
