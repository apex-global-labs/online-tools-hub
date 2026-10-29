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
- `app.js`: 20-tool catalogue, card filtering, workspace lifecycle and tool implementations.
- `js/live-search.js`: autocomplete suggestions, keyboard handling, category dropdown behavior and slash shortcut.
- `js/tools-data.json`: metadata for 8 modular router routes; this is not the full 20-tool catalogue.
- `js/router.js`: modular hash route parser/resolver.
- `js/router-bridge.js`: connects modular routes to existing tool launch behavior.
- `README.md`: setup and feature overview.

## Completed / existing features
- Search by tool name, category and description.
- Category chips and Categories dropdown.
- Search suggestions with tool launch on click or Enter.
- `Ctrl+K` / `Cmd+K` focuses the search field; `/` shortcut focuses search when not typing.
- Light / Night toggle; selected theme is now saved in local storage when available.
- Animated sunrise in Day mode; moonrise and softly twinkling stars in Night mode.
- Dark-mode contrast overrides for header, hero, cards, fields, outputs and footer.
- Modular hash router and legacy tool URL bridge.
- 20 tool definitions in `app.js`; the metadata file currently has 8 route records, so it must not be treated as the complete tool catalogue.
- Phase 2 UI behavior (search, category menu, Ctrl+K and theme animation) was manually checked by the owner. The latest persistence and arrow-key navigation additions have not yet been separately confirmed by the owner on the live site.

## Phase 2 final polish in progress
- Persist the selected Day/Night theme between page loads.
- Support Up/Down arrow navigation through search suggestions, Escape to close, and accessible suggestion state.
- Update documentation to reflect the actual file structure and tool count.
- After merge/deploy, do a desktop and mobile regression pass before marking these latest changes as verified.

## Suggested verification checklist
1. Search for `json`, use arrow keys and Enter to launch the suggestion.
2. Press Escape to close suggestions; click outside the search box and confirm they close.
3. Select a category from the header dropdown and confirm the matching category chip/filter updates.
4. Switch to Night, reload the page, and confirm Night remains selected; switch to Day, reload, and confirm Day remains selected.
5. Verify sun/moon/stars, search text contrast, cards, tool workspace, form fields and result output in both themes.
6. Test the same interactions at a narrow mobile width.
7. Open QR Generator, JSON Formatter, Text Case Converter, Unit Converter and one other tool; confirm launch, close and browser Back/Forward behavior.

## Known constraints / follow-up items
- `js/tools-data.json` contains 8 entries while `app.js` currently has 20 tool definitions. Keep the modular router metadata synchronized as route coverage is expanded.
- Tailwind browser CDN is intended for prototyping; compiling CSS locally can be considered later but is not required for the current free deployment.
- No automated browser test suite is configured. Do not describe the latest changes as fully visually verified until a live regression pass is completed.
- Check small-screen navigation and hero decoration for overlap.
- Confirm whether the owner wants to expand from the current 20 tools to the 25-tool target. The previously proposed additions included Regex Tester, Unix Timestamp Converter, Extra Spaces Remover, Image Resizer, Image Compressor and Image Format Converter; avoid adding more tools until the phase plan is confirmed.

## Next 4–5 day roadmap (suggested, not yet implemented)
- Day 1: verify phase 2 fixes on desktop/mobile and resolve any reported regression.
- Day 2: synchronize router metadata with the intended route catalogue and test all routes.
- Day 3: review the existing 20 tools for correctness, empty input, invalid input and copy/download behavior.
- Day 4: decide and implement the next 5 tools from the agreed priority list; keep processing local where feasible.
- Day 5: SEO basics, accessibility pass, performance review and update this document with verified outcomes.

## Safe-change rules
- Keep the current static/free hosting approach.
- Make changes on a feature branch and merge through a pull request.
- Change only files required for the task; do not rewrite working tools during UI polish.
- Clearly separate verified behavior from assumptions or untested changes.
