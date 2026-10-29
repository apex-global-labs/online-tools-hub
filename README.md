# ToolNest — Free Online Tools

A static, browser-based multi-tool website. No backend or build step is required.

## Files
- `index.html` — page structure and tool workspace
- `style.css` — responsive visual styling and theme variables
- `app.js` — search, category filters, and 15 tool implementations

## Run locally
Open `index.html` in a modern browser while connected to the internet. Tailwind and QRious are loaded from CDNs.

## Deploy with GitHub Pages
1. Create a public repository on GitHub.
2. Upload all three files to the repository root.
3. Open Settings → Pages.
4. Under Build and deployment, select Deploy from a branch.
5. Select `main` and `/(root)`, then Save.
6. Wait for the published URL shown in the Pages section.

## Notes
Tailwind's browser CDN is intended for prototyping rather than optimized production builds. For a public site that grows, consider compiling Tailwind to a static CSS file later. Verify all tools and test on mobile before promoting the site.
