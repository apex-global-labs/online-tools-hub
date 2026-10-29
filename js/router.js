/**
 * ToolNest Phase 1 — minimal hash router.
 * Route format: #/tools/:slug
 *
 * The router resolves modern #/tools/:slug URLs against tools-data.json.
 * router-bridge.js connects resolved routes to the existing tool workspace;
 * the legacy #tool/:id links remain supported by app.js.
 */

const TOOLS_DATA_URL = new URL("./tools-data.json", import.meta.url);

export async function loadToolsData() {
  const response = await fetch(TOOLS_DATA_URL);
  if (!response.ok) {
    throw new Error(`Could not load tool metadata (HTTP ${response.status}).`);
  }

  const tools = await response.json();
  if (!Array.isArray(tools)) {
    throw new TypeError("Tool metadata must be a JSON array.");
  }

  return tools;
}

export function parseRoute(hash = window.location.hash) {
  const normalizedHash = String(hash || "").replace(/^#/, "");
  const match = normalizedHash.match(/^\/tools\/([a-z0-9-]+)\/?$/i);

  if (!normalizedHash || normalizedHash === "/") {
    return { name: "home" };
  }

  if (!match) {
    return { name: "not-found" };
  }

  return { name: "tool", slug: match[1] };
}

export async function resolveRoute(hash = window.location.hash) {
  const route = parseRoute(hash);

  if (route.name !== "tool") {
    return route;
  }

  const tools = await loadToolsData();
  // Route parsing is case-insensitive, so resolve slugs consistently too.
  const normalizedSlug = route.slug.toLowerCase();
  const tool = tools.find((item) => item.slug.toLowerCase() === normalizedSlug);

  return tool
    ? { name: "tool", tool }
    : { name: "not-found", slug: route.slug };
}

/**
 * Register a route callback. The host page decides how to render each result.
 * Returns a cleanup function so the listener can be removed when needed.
 */
export function initRouter(onRouteChange) {
  if (typeof onRouteChange !== "function") {
    throw new TypeError("initRouter requires a route callback.");
  }

  let active = false;

  const handleRoute = async () => {
    try {
      onRouteChange(await resolveRoute());
    } catch (error) {
      onRouteChange({ name: "error", error });
    }
  };

  const start = () => {
    if (active) return;
    active = true;
    window.addEventListener("hashchange", handleRoute);
    void handleRoute();
  };

  const stop = () => {
    if (!active) return;
    active = false;
    window.removeEventListener("hashchange", handleRoute);
  };

  start();
  return stop;
}
