# ToolNest / Online Tools Hub — Project State

Last updated: 2026-10-30


> **Authoritative status note (2026-10-30):** This section is the current source of truth. Older handover notes and phase descriptions further below are historical records; where they say work is pending or unmerged, this current status supersedes that wording.


## Phase 13 — Advanced Converters & Math Tools (merged)
- Work branch: `phase13-advanced-converters`; merged through [PR #33](https://github.com/apex-global-labs/online-tools-hub/pull/33).
- Production merge commit: `651551d57ce958386228cd356b53812f8a648200`.
- Adds **Area Converter**, **Bangladesh Land Unit Converter**, **Time Zone Converter** and **Number to Words Converter** (English and Bangla). Catalogue total: **33 tools**.
- Area Converter supports square metres, square feet, square yards, acres, hectares and square kilometres.
- Bangladesh land converter uses the documented conventional factors: 1 shotok = 435.6 ft²; 1 katha = 720 ft²; 1 bigha = 20 katha = 14,400 ft²; 1 acre = 100 shotok = 43,560 ft². The UI warns that local units vary and advises checking local deed/measurement standards.
- Time Zone Converter uses browser IANA time-zone rules. It detects skipped local times and chooses the earlier occurrence for ambiguous repeated times.
- Number to Words supports English and Bangla, negative values, up to two decimal places and values through ±999,999,999,999.
- Helpers live in `js/advanced-converters.js`; all four tools have individual SEO descriptions, How to Use steps, features and FAQs. No backend, paid API or new third-party runtime dependency was added.
- Pull-request regression run **41039526675** and post-merge `main` run **41039590292** passed: **52 tests, 52 passed, 0 failed**. JavaScript syntax checks passed.
- GitHub Pages run **41039589834** built the site artifact successfully; final deployment status is being verified separately.
- Real-browser interaction QA remains pending. Do not describe clipboard/download/Clear, visual responsiveness, theme or browser-console behavior as browser-tested.

## Phase 12 — Calculator & Finance Tools (merged)
- Work branch: `phase12-finance-calculators`; merged to `main` through [PR #31](https://github.com/apex-global-labs/online-tools-hub/pull/31).
- Adds **Percentage Calculator**, **Compound Interest Calculator** and **EMI / Loan Calculator**. The complete catalogue now contains **29 tools**.
- Percentage Calculator supports percent-of, part-as-percent-of-whole and percentage increase/decrease.
- Compound Interest Calculator supports annual, semi-annual, quarterly, monthly and daily compounding, with principal, annual nominal rate, time in years and selectable display currency.
- EMI Calculator uses a fixed-rate monthly reducing-balance formula and shows monthly instalment, total interest and total repayment. Tenure is limited to 1–600 months.
- Pure formula helpers live in `js/finance-calculators.js`. Inputs, rates, result ranges, zero denominators, compounding frequencies, zero-interest loans and overflow cases are validated.
- The currency selector changes display formatting only; no currency conversion or live financial data is fetched by these calculators. No backend, paid API, or new third-party runtime dependency was added.
- Pull-request regression workflow **41035773406** and post-merge `main` regression workflow **41035951034** passed: **40 tests, 40 passed, 0 failed**.
- GitHub Pages build/deployment workflow **41035949638** completed successfully after the application merge.
- Automated tests and deployment are verified. Real-browser interaction QA (actual input, Copy/Download/Clear, mobile layout, theme and console checks) remains pending and must not be described as passed.


## Phase 11 — Text & Writing Tools (merged)
- Work branch: `phase11-text-writing`; merged to `main` through PR #26. Verification-state documentation was finalized through PR #27.
- Phase 11 adds **Lorem Ipsum Generator** as the 26th tool. Existing Text Diff Checker, Word & Character Counter, Text Case Converter and Extra Spaces Remover are retained; no duplicate versions are introduced.
- Text Case Converter and Word & Character Counter now count Unicode code points for character totals, so supplementary Unicode characters are not counted as two characters.
- Extra Spaces Remover accepts whitespace-only input and cleans it instead of treating it as missing input.
- Lorem Ipsum Generator supports 1–10 paragraphs, 1–8 sentences per paragraph, an optional classic opening, and local generation.
- Unicode ↔ Bijoy conversion is explicitly out of scope.
- Regression coverage and metadata/catalogue synchronization are included. PR #26 was merged to `main` as commit `1bfce56a13f0b9ee0147ec1d71c64a7cd3328046`.
- PR regression workflow run **41033005867** and post-merge `main` regression run **41033055609** completed successfully.
- GitHub Pages build/deployment run **41033055683** completed successfully after the merge.
- Real-browser interaction QA remains pending; deployment success and source/CI tests do not prove clipboard, download, Clear, responsive layout or theme behavior in a browser.

## Current production status — 2026-10-30

- Production branch: `main`; latest application release is Phase 13, merged through [PR #33](https://github.com/apex-global-labs/online-tools-hub/pull/33), commit `651551d57ce958386228cd356b53812f8a648200`.
- Phase 6 SEO content, QR Studio, Phase 9 audit, Phase 10 additions, Phase 11 Text & Writing Tools, Phase 12 Calculator & Finance Tools and Phase 13 Advanced Converters are merged.
- Catalogue status: **33 tools**. `app.js` and `js/tools-data.json` contain matching unique tool IDs; all 33 have tool-specific SEO metadata and unique slugs.
- Phase 10 added Unix Timestamp Converter, Extra Spaces Remover, HTML Entity Encoder / Decoder, Image Resizer and Image Compressor.
- Phase 11 added Lorem Ipsum Generator and improved Unicode-aware character totals in Text Case Converter and Word & Character Counter, plus whitespace-only cleanup in Extra Spaces Remover. Existing text tools were retained without duplicates.
- Phase 12 added Percentage Calculator, Compound Interest Calculator and EMI / Loan Calculator. Formulas are local, bounded and covered by automated tests; no live rates are used by these three calculators.
- Phase 13 added Area Converter, Bangladesh Land Unit Converter, Time Zone Converter and Number to Words Converter (English and Bangla). Conversion helpers are browser-local; Bangladesh land-unit assumptions are stated in the UI, and IANA daylight-saving transitions are handled.
- Unicode ↔ Bijoy conversion is explicitly excluded.
- Phase 12 PR regression run **41035773406** and post-merge `main` regression run **41035951034** passed: **40/40 tests**.
- Phase 13 PR regression run **41039526675** and post-merge `main` regression run **41039590292** passed: **52/52 tests**; JavaScript syntax checks passed.
- GitHub Pages build/deployment workflow **41039589834** built the site artifact successfully; final deployment completion remains separately verified.
- GitHub Pages build/deployment run **41035949638** completed successfully after the Phase 12 merge.
- No new backend, paid service or third-party runtime dependency was added for Phase 12.
- **Real-browser interaction QA remains pending for all 29 tools.** CI and deployment do not prove actual clipboard/download/Clear behavior, responsive layout, Day/Night rendering, route interactions or browser-console behavior.
- Phase 4 Escape-key issue remains deferred.

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
- `app.js`: 26-tool catalogue, card filtering, workspace lifecycle and tool implementations.
- `js/live-search.js`: autocomplete suggestions, keyboard handling, category dropdown behavior and slash shortcut.
- `js/tools-data.json`: modular router metadata. `main` now contains 26 entries matching the 26 tools in `app.js`; automated consistency checks passed, while live route regression checks remain pending.
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

## Phase 3C — JSON-driven category grid polish
- Work branch: `phase3-json-driven-category-grid`; PR pending.
- Category pills are centered and now read All Tools, Text Utilities, Image Tools, Dev Tools, Calculators, and Utilities. The Categories menu includes the same extra Utilities option.
- `js/tools-data.json` contains all 20 tools plus description and tagline fields for card display.
- `app.js` fetches the JSON metadata to render card title, category, icon, slug, description, and tagline while retaining the existing implementation catalogue as a fallback if the fetch fails.
- Responsive card grid is configured for two columns on mobile, three on medium screens, and four on wide desktop screens.
- Regression checks were added for JSON-driven cards, metadata descriptions/taglines, category labels, and responsive CSS. CI verification is pending.
- Live-browser verification remains pending; source/CI checks do not establish that the published page has deployed or renders correctly in a real browser.

## Tool behavior audit — PR #9
- PR: https://github.com/apex-global-labs/online-tools-hub/pull/9
- Added Copy actions to Text Diff Checker, Markdown Previewer, Forex Currency Converter, Unit Converter, and Age & Date Difference.
- Markdown Copy uses the rendered preview's visible text. Clipboard unavailability and empty output now produce a clear message instead of an uncaught clipboard access error.
- Added `tests/tools-audit.test.mjs` to check the 20-tool catalogue against router metadata, confirm each tool has markup and wiring, verify Copy actions, and guard the QR PNG download behavior.
- Added `.github/workflows/tests.yml` to run router and tool-audit tests on pull requests and pushes to `main`.
- GitHub Actions run #1 for PR #9 completed successfully. Connector-side source checks also confirm 20 catalogue entries, 20 metadata entries with matching IDs, and all 20 tools having markup and event-wiring branches.
- Source audit identified four edge cases; follow-up PR #10 (https://github.com/apex-global-labs/online-tools-hub/pull/10) adds explicit guards for temperatures below absolute zero, future start dates, non-HTTP(S) canonical URLs, and image files larger than 10 MB. Regression tests cover these guards. These fixes are source-tested and do not replace live-browser testing.
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

1. **Phase 9 — Full audit of the existing 20 tools.** Check empty and invalid inputs, Convert/Generate actions, Copy/Download/Clear, visible error handling, mobile layout, dark mode, and browser-console errors. Record which checks are automated, owner-tested, or still pending. Do not assume that the universal buttons are fully functional on every tool merely because they render.
2. **Phase 10 — Grow from 20 to 25 tools.** Select five low-risk, browser-side tools after the audit. Candidates: Regex Tester, Unix Timestamp Converter, Extra Spaces Remover, Image Resizer, and Image Compressor. Review scope and browser compatibility before implementation.
3. After the tool audit and additions, complete accessibility, performance, and SEO reviews. Keep the static GitHub Pages architecture unless a concrete requirement justifies a change.

## Safe-change rules
- Keep the current static/free hosting approach.
- Make changes on a feature branch and merge through a pull request.
- Only merge to `main` when the owner has clearly authorized the merge and the risk has been reviewed.
- Change only files required for the task; do not rewrite working tools during metadata synchronization.
- Clearly separate verified behavior from assumptions or untested changes.


## Phase 4 — Universal Tool Workspace Template
- Work branch: `phase4-universal-tool-workspace`; merged via PR #13.
- Merge commit: `4b66933112c5d8bebfce4bb69ad2086f4bc475d0`.
- Keeps all 20 existing tool implementations and adds a shared responsive workspace card around their current markup; no tool algorithms are intentionally rewritten.
- Adds dynamic Home > Category > Tool breadcrumb, workspace heading/description, back-to-tools control and a styled 404 state for unknown tool IDs/slugs.
- Adds bottom-screen toast notifications for existing success/error messages while retaining the inline accessible status message.
- Supports modern `#/tools/:slug` URLs and legacy `#tool/:id` URLs; router bridge handles unresolved routes explicitly.
- Adds workspace-specific responsive/dark-mode/focus/reduced-motion styles and source-level regression tests.
- Verification: PR CI passed and post-merge regression tests passed. Live deployment was subsequently confirmed with the Phase 5 deployment run. Owner-reported live checks have confirmed key category/search/theme behaviors from earlier phases, but Phase 4 direct slug navigation, Back/Forward, toast and 404 behavior have not all been independently confirmed. The Escape-key issue is deferred for a later fix; do not mark it resolved.

## Phase 5 — Universal tool actions
- Work branch: `phase5-universal-tool-actions`; merged via PR #14.
- Merge commit: `1da9efecc7b869e7f0c0c7321b0f44c0cbb053da`.
- Adds a consistent action row to every tool workspace: Copy result, Download result, and Clear.
- Copy uses the generated text/result; Markdown copies the visible preview text; QR Code Generator copies the QR payload text because browsers do not provide a dependable plain-text button for copying a canvas image.
- Download saves text results as a UTF-8 `.txt` file and downloads the generated QR canvas as a PNG. Empty results show a helpful message instead of downloading a blank file.
- Clear resets tool inputs, file selection, selections/checks, text outputs, previews, QR output, color swatch, and statistics.
- Existing tool-specific Convert/Generate actions remain intact; conversion buttons are kept tool-appropriate rather than forcing a meaningless Convert button onto generators or analysis tools.
- Verification: post-merge regression CI run #40959837740 completed successfully; GitHub Pages deployment run #40959837345 completed successfully. Owner confirmed that the three universal action buttons are visible on the live JSON Formatter workspace. Their actual Copy, Download and Clear behavior has not yet been fully exercised in the browser.


## Current handover — 2026-10-30
- Current production baseline: Phase 4 and Phase 5 are merged into `main`; latest relevant merge is Phase 5 PR #14 (merge commit `1da9efecc7b869e7f0c0c7321b0f44c0cbb053da`).
- Latest CI regression run: #40959837740 — completed successfully.
- Latest GitHub Pages deployment run: #40959837345 — completed successfully.
- Owner's live-site report: universal Copy result, Download result and Clear buttons are visible in the JSON Formatter workspace. Button functionality is not yet confirmed.
- Phase 4 live verification remains incomplete: test modern direct slug route, browser Back/Forward, breadcrumb/home navigation, toast and unknown-route 404 behavior. Owner reported the Escape-key behavior is broken; defer fixing it until a later dedicated task.
- Next action: finish live verification one step at a time, beginning with browser Back from an open tool. Do not start Phase 6 until the owner decides to proceed after the outstanding checks or explicitly accepts deferring them.
- No browser automation was run by the assistant; distinguish GitHub CI/deployment success from actual browser behavior.

## Phase 6 — Below-the-tool SEO content and FAQ (in progress)
- Work branch: `phase6-seo-content-faq`; changes are not merged into `main`.
- Adds a unique SEO description, three usage steps, feature bullets and three tool-specific FAQs for each of the 20 tools in `js/tools-data.json` (60 FAQ entries total).
- Adds `js/seo-content.js`, which loads the metadata and renders the current tool's guide, features and semantic `details/summary` FAQ accordion below the existing tool workspace. Existing tool algorithms and action handlers are not intentionally changed.
- Adds dynamic FAQPage JSON-LD based on the same FAQ data displayed to visitors; the schema is cleared when leaving the tool workspace.
- Adds `css/phase6-seo-content.css` for responsive, dark-mode-aware styling and loads the new assets from `index.html`.
- Adds `tests/seo-content.test.mjs` to check completeness of the 20 SEO records, renderer integration, FAQ schema generation, safe text rendering and responsive styles.
- Important SEO limitation: this site is a static single-page app with hash-based tool routes. Client-rendered SEO content and JSON-LD are useful enhancements, but they do not provide the same crawl/indexing guarantees as separately rendered HTML pages. FAQ rich-result display is controlled by Google and is not guaranteed.
- Verification status: source changes are committed to the feature branch. Automated PR CI and real-browser verification are pending. Test modern and legacy routes, confirm the SEO section appears below the workspace, check accordion behavior and dark/mobile layouts, and validate the rendered FAQPage JSON-LD before considering merge.
- Do not merge this phase without the owner's explicit approval.
- QA follow-up: initial PR CI exposed two regression-test assertion issues (test-source escaping and checking for a directly-created `summary` element when the renderer uses the safe `makeElement` helper). Both test assertions were corrected. The latest PR CI run #24 then passed.


## Phase 8 — QR Studio Default / Custom Mode and Image Blend (2026-10-30)
- Work branch: `phase8-qr-custom-blend`; changes are being prepared for review.
- Reworks the QR Generator into a simple Default Mode and an advanced Custom Mode.
- Default Mode uses a black-and-white square QR; Custom Mode offers five named color palettes and five dot shapes.
- Adds optional local image blending beneath the QR pattern using the Canvas API with adjustable low opacity; PNG output includes the blended artwork.
- Uses `qr-code-styling` with error correction level H. SVG export remains a clean vector QR without the Canvas-only artwork blend.
- All image processing stays in the visitor's browser; uploaded artwork is not sent to a server.
- Important limitation: high error correction does not guarantee that every blended QR will scan. Users must scan-test the exported image; image blending is intentionally subtle.
- Automated tests and deployment verification are pending. Do not claim live behavior is verified until CI, Pages deployment, and owner browser checks are complete.


## QR image visibility adjustment (2026-10-30)
- Increased Custom Mode image blend slider range from 4–20% to 20–60%, with 50% as the default.
- Clear/reset now returns blend visibility to 50%.
- Added an on-screen warning that stronger artwork visibility can reduce QR scan reliability and that downloaded PNGs should be tested with a phone camera.
- QR foreground pattern remains drawn above the artwork; error correction remains H. High visibility is not a guarantee of scanability.
