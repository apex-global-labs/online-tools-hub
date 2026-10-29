# ToolNest / Online Tools Hub — Project State

Last updated: 2026-10-30

## Project goal
Build a modern, fast, mobile-friendly multi-utility website with a light/night theme, search and category navigation, and browser-side processing where practical. Keep hosting free using GitHub Pages. The owner is a beginner, so changes should be incremental, easy to verify, and avoid breaking working tools.

## Repository and live site
- Repository: https://github.com/apex-global-labs/online-tools-hub
- Live site: https://apex-global-labs.github.io/online-tools-hub/
- Deployment: GitHub Pages from `main` and repository root.
- Architecture: static HTML/CSS/Vanilla JavaScript; no backend or build step.
- External dependencies currently used: Tailwind browser CDN and QRious CDN. Currency conversion fetches a public exchange-rate endpoint.

## Current structure
- `index.html`: site header, hero, search, category filters, tool cards, workspace, about section and footer.
- `style.css`: base layout, theme variables, responsive styling and tool UI.
- `css/phase2.css`: phase 2 navigation/search styles, dark-mode contrast overrides and animated day/night hero scene.
- `css/phase3-category-grid.css`: responsive category filter pills and card-grid presentation for Phase 3.
- `app.js`: 20-tool catalogue, card filtering, workspace lifecycle and tool implementations.
- `js/live-search.js`: autocomplete suggestions, keyboard handling, category dropdown behavior and slash shortcut.
- `js/tools-data.json`: modular router metadata. Phase 3 branch now contains 20 entries intended to match the 20 tools in `app.js`; see verification status below.
- `js/router.js`: modular hash route parser/resolver for `#/tools/:slug`.
- `js/router-bridge.js`: connects modular routes to existing tool launch behavior.
- `README.md`: setup and feature overview.

## Completed / existing features
- Search by tool name, category and description.
- Category chips and Categories dropdown.
- Search suggestions with tool launch on click or Enter.
- `Ctrl+K` / `Cmd+K` focuses the search field; `/` shortcut focuses search when not typing.
- Light / Night toggle; selected theme is saved in local storage when available.
- Animated sunrise in Day mode; moonrise and softly twinkling stars in Night mode.
- Dark-mode contrast overrides for header, hero, cards, fields, outputs and footer.
- Modular hash router and legacy tool URL bridge.
- Phase 2 interactions (theme persistence and search keyboard navigation) were manually verified by the owner on the live site.

## Phase 3 — Router Metadata Synchronization
- Working branch: `feature/phase-3-router-metadata-sync`.
- Updated `js/tools-data.json` from 8 metadata records to 20 records, retaining existing IDs and slugs and adding metadata for the other 12 catalogue tools.
- Slugs are unique, lowercase URL-friendly strings; IDs continue to match the `app.js` tool IDs.
- Kept `app.js`, `js/router.js`, and `js/router-bridge.js` unchanged to minimize regression risk.
- Verification status: metadata file was written to the feature branch. Automated consistency checks and live route regression checks are still pending; do not treat this phase as fully verified until those checks pass.
- Main branch and live site have not been intentionally changed by this phase.

## Phase 3B — Category Grid & Tool Cards Layout
- Working branch: `feature/phase-3-category-grid` (based on `feature/phase-3-router-metadata-sync`; dependent on PR #5).
- Homepage category pills are reduced to All, Text, Images, Dev Tools and Calculators. Existing internal category values are retained to avoid changing tool implementations; the Password Generator remains available under All/search.
- Tool cards now include a short, tool-specific tagline in addition to the icon, category, name and description.
- Added responsive card grid breakpoints: one column on narrow phones, two on wider phones, three on tablets/small desktops, and four on wide screens. Added hover/focus and reduced-motion styling, plus dark-mode overrides.
- `index.html`, `app.js`, and a dedicated CSS file were changed; tool implementations and router logic were not intentionally rewritten.
- Verification status: source edits are on the feature branch. Browser/mobile regression checks are still pending; do not treat this phase as fully verified until those pass.

## Suggested verification checklist
1. Parse `js/tools-data.json` as JSON and confirm exactly 20 entries.
2. Compare every metadata ID and title with the catalogue in `app.js`; confirm no missing or extra IDs.
3. Confirm all IDs and slugs are unique and every slug matches the router's allowed pattern `[a-z0-9-]+`.
4. Resolve each `#/tools/:slug` route against metadata and confirm the resolved ID exists in the catalogue.
5. Test representative new and existing routes in a browser, including QR Generator, JSON Formatter, Unit Converter, Text Diff Checker and Duplicate Lines Remover.
6. Verify legacy `#tool/:id` links and normal card launches remain functional.
7. Check browser Back/Forward behavior and a narrow mobile viewport.

## Known constraints / follow-up items
- No automated browser test suite is configured.
- The router metadata is a routing index, not the source of tool implementation; tool behavior remains in `app.js`.
- Tailwind's browser CDN is intended for prototyping; compiling CSS locally can be considered later but is not required for the current free deployment.
- Check small-screen navigation and hero decoration for overlap.
- After Phase 3, review all 20 tools for input validation, error handling and Copy/Download behavior.
- The longer-term goal is 25 tools. Proposed candidates have included Regex Tester, Unix Timestamp Converter, Extra Spaces Remover, Image Resizer, Image Compressor and Image Format Converter; choose the final five only after reviewing risk and scope.

## Next roadmap
1. Complete browser checks for PR #5 metadata routes and the dependent category-grid branch.
2. Review both pull requests and merge only with owner approval.
3. Verify the live site, legacy routes, category filters, search, theme and mobile layout after approved merge.
4. Audit the existing 20 tools for empty/invalid inputs, error handling and Copy/Download behavior.
5. Choose and implement five additional tools using free, browser-side processing where practical; then complete SEO, accessibility and performance reviews.

## Safe-change rules
- Keep the current static/free hosting approach.
- Make changes on a feature branch and merge through a pull request.
- Never merge to `main` without the owner's approval.
- Change only files required for the task; do not rewrite working tools during metadata synchronization.
- Clearly separate verified behavior from assumptions or untested changes.
