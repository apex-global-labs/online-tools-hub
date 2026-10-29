# ToolNest — Free Online Tools

A static, browser-based multi-tool website. No backend or build step is required. The public site is hosted on GitHub Pages.

## Main files
- `index.html` — page structure, header, hero search, tool grid, workspace and footer
- `style.css` — base responsive styling and light/dark theme variables
- `css/phase2.css` — search/navigation styling, dark-mode contrast and animated sun/moon scene
- `app.js` — tool catalogue, filters, workspace rendering, theme toggle and tool implementations
- `js/live-search.js` — search autocomplete, keyboard navigation, category menu behavior and slash shortcut
- `js/tools-data.json` — metadata used by the modular hash router
- `js/router.js` — route parsing/resolution
- `js/router-bridge.js` — bridge from modular routes to the existing tool workspace
- `PROJECT_STATE.md` — current status, verification notes and next-step roadmap

## Current UI features
- Search tools by name, category or description
- Autocomplete suggestions; Enter, Escape and arrow-key navigation
- `Ctrl+K` / `Cmd+K` focuses the search field; `/` is an additional shortcut when not typing
- Category filter chips and a Categories dropdown
- Light / Night theme toggle with a rising sun or moon scene and subtle stars at night
- Theme preference is saved when browser storage is available
- Responsive layout and reduced-motion support for the decorative scene

## Run locally
Open `index.html` in a modern browser while connected to the internet. Tailwind CSS and QRious are loaded from CDNs. Some features such as QR generation require the CDN to load.

## Deploy with GitHub Pages
1. Open repository **Settings → Pages**.
2. Under Build and deployment, select **Deploy from a branch**.
3. Select `main` and `/(root)`, then save.
4. Wait for GitHub Pages to publish the latest commit.

## Important notes
- Tool processing is browser-based unless a tool explicitly fetches a public reference service (the currency converter retrieves exchange-rate data).
- Avoid describing every tool as fully private: the currency converter makes a network request, and external libraries are loaded from CDNs.
- Tailwind's browser CDN is convenient for a prototype; a production build can later compile and pin assets locally.
- Phase 2 UI interactions have been manually spot-checked by the owner. The newest theme-persistence and keyboard-navigation changes should be re-tested on desktop and mobile after deployment.
