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
- `js/tools-data.json`: modular router metadata. `main` now contains 20 entries intended to match the 20 tools in `app.js`; automated consistency checks passed, while live route regression checks remain pending.
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
- Merged into `main` via PR #5 (`f1d7dac251f11ea6d817762f6d352237befc97a6`).
- Updated `js/tools-data.json` from 8 metadata records to 20 records, retaining existing IDs and slugs and adding metadata for the other 12 catalogue tools.
- Slugs are unique, lowercase URL-friendly strings; IDs continue to match the `app.js` tool IDs.
- Kept `app.js`, `js/router.js`, and `js/router-bridge.js` unchanged to minimize regression risk.
- Verification status: automated source consistency checks passed (20 records; no missing/extra IDs, duplicate IDs/slugs, invalid slugs or title mismatches). Added router regression tests and normalized case-insensitive slug lookup in PR #8 (`a57b340c05c5c13c287541b6de6a27ad78884b5d`). Ten Node regression cases passed in a local test run using the fetched source/test files. Live browser route checks remain pending.
- `main` has been updated. GitHub Pages deployment and live route behavior still need verification.

## Phase 3B — Category Grid & Tool Cards Layout
- Merged into `main` via PR #7 (`d657766208245b900395c8220e7f4d87e698ec1a`); PR: https://github.com/apex-global-labs/online-tools-hub/pull/7.
- Homepage category pills are reduced to All, Text, Images, Dev Tools and Calculators. Existing internal category values are retained to avoid changing tool implementations; the Password Generator remains available under All/search.
- Tool cards now include a short, tool-specific tagline in addition to the icon, category, name and description.
- Added responsive card grid breakpoints: one column on narrow phones, two on wider phones, three on tablets/small desktops, and four on wide screens. Added hover/focus and reduced-motion styling, plus dark-mode overrides.
- `index.html`, `app.js`, and a dedicated CSS file were changed; tool implementations and router logic were not intentionally rewritten.
- Verification status: changes are merged into `main` via PR #7 (`d657766208245b900395c8220e7f4d87e698ec1a`). Source-level checks passed, including 20 card taglines, five category labels, stylesheet linkage and responsive/dark-mode rules. Interactive browser/mobile regression checks and confirmation of the live GitHub Pages deployment remain pending.

## Tool behavior audit — PR #9
- PR: https://github.com/apex-global-labs/online-tools-hub/pull/9
- Added Copy actions to Text Diff Checker, Markdown Previewer, Forex Currency Converter, Unit Converter, and Age & Date Difference.
- Markdown Copy uses the rendered preview's visible text. Clipboard unavailability and empty output now produce a clear message instead of an uncaught clipboard access error.
- Added `tests/tools-audit.test.mjs` to check the 20-tool catalogue against router metadata, confirm each tool has markup and wiring, verify Copy actions, and guard the QR PNG download behavior.
- Added `.github/workflows/tests.yml` to run router and tool-audit tests on pull requests and pushes to `main`.
- GitHub Actions run #1 for PR #9 completed successfully. Connector-side source checks also confirm 20 catalogue entries, 20 metadata entries with matching IDs, and all 20 tools having markup and event-wiring branches.
- Source audit notes for follow-up hardening: the Unit Converter does not explicitly reject temperatures below absolute zero; the Age Calculator relies on the date input's maximum rather than explicitly rejecting a future start date in its handler; the Meta Tag Generator does not validate an optional canonical URL; and Image to Base64 has no file-size warning/limit. These are review findings, not claims of live-browser failures.
- Live GitHub Pages/browser verification is still pending. The available web retrieval returned `DisabledError`, and the connected GitHub tools did not expose a confirmed Pages deployment status. Do not mark live route, visual, mobile, or clipboard behavior as verified until tested in a real browser.

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
1. Verify the live site after the Phase 3B and router-fix merges: category filters, search, theme persistence, tool launches, metadata routes, legacy routes and mobile layout.
2. Add/extend automated checks for app-level behavior and audit the existing 20 tools for input validation, error handling and Copy/Download behavior.
3. Audit the existing 20 tools for empty/invalid inputs, error handling and Copy/Download behavior.
4. Choose and implement five additional tools using free, browser-side processing where practical; then complete SEO, accessibility and performance reviews.

## Safe-change rules
- Keep the current static/free hosting approach.
- Make changes on a feature branch and merge through a pull request.
- Only merge to `main` when the owner has clearly authorized the merge and the risk has been reviewed.
- Change only files required for the task; do not rewrite working tools during metadata synchronization.
- Clearly separate verified behavior from assumptions or untested changes.
