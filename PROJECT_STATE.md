# ToolNest / Online Tools Hub — Project State

Last updated: 2026-11-01

> **Authoritative status:** This section reflects the latest verified repository, CI and GitHub Pages deployment baseline. Historical phase notes below must not override it.

## Current production baseline

- Repository: https://github.com/apex-global-labs/online-tools-hub
- Live site: https://apex-global-labs.github.io/online-tools-hub/
- Production branch: `main`
- Latest main commit: `ca9b9ad737c6a5f8b48fcdff09b5068947270fe6` (PR #107: exact duplicate copy removed across tool guides).
- Catalogue: **55 unique tools**, **55 individual crawlable SEO guides**, and **61 unique sitemap URLs** (homepage + directory + 55 guides + About, Contact, Privacy and Terms).
- PR #102 merged: homepage native sharing, copy-link, WhatsApp and Telegram.
- PR #103 merged at `49df2adaef40198750040abb93d5687d314918d1`: QR guide claims aligned with the implemented plain-text/URL payloads, customization and PNG/SVG export; visible FAQs and structured data synchronized.
- PR #104 merged at `8f6f3b38dfdf86fa6b6218bf243d5553064d6285`: contextual links on ten guides and keyword-map integrity tests.
- PR #105 merged at `79904296c60f8b95e64f11b88059f525c616f607`: production baseline and project documentation refreshed.
- PR #106 merged at `176318174d767c53c76592c71fff939c24d02137`: homepage Organization/WebSite schema, 55-item directory CollectionPage/ItemList schema, site-root `llms.txt`, sitemap lastmod updates, improved internal links and G2 SEO regression coverage.
- PR #107 merged at `ca9b9ad737c6a5f8b48fcdff09b5068947270fe6`: repeated FAQ questions, how-to steps and feature statements removed across the shared metadata and corresponding static guides.
- Latest main regression workflow **#520** (run `41268111737`) completed successfully: **178 tests passed, 0 failed**; JavaScript syntax checks passed.
- GitHub Pages deployment workflow **#151** (run `41268111458`) completed successfully: Jekyll build, artifact upload, deploy and build-status reporting all succeeded.
- All 55 tool guide titles and meta descriptions are unique; descriptions remain within the existing 110–160 character test range. All 55 guides have the expected canonical URL, exactly one H1, index/follow directive, crawlable static HTML, WebApplication/BreadcrumbList/FAQPage JSON-LD, visible FAQ content, how-to steps, features and practical guidance.
- Exact FAQ-question, how-to-step and feature-statement duplication across the 55 tool metadata records is now covered by regression tests and has been removed.
- All 55 guides have at least two unique, catalogue-valid related-tool links. The regression test checks each target against the active catalogue, prevents self-links and rejects duplicate targets.
- The tool directory contains crawlable links to all 55 guides and now publishes a CollectionPage/ItemList schema with 55 canonical URLs. The homepage publishes Organization and WebSite schemas.
- `llms.txt` is published at the ToolNest project-site root and lists the canonical pages, all 55 guides, current descriptions and important feature/privacy caveats. It is best-effort machine-readable context, not a universal crawler directive or ranking factor.
- Sitemap contains **61 unique canonical URLs**. The lastmod date was refreshed for the 15 guide pages edited in the SEO passes and for the updated directory and About page. The URL inventory remains unchanged.
- Google Search Console is verified for the exact property `https://apex-global-labs.github.io/online-tools-hub/`. Windsor.ai returned no Search Analytics rows for 2026-10-25 through 2026-11-01; impressions, clicks, CTR, average position, query/page performance and indexing counts therefore remain unverified. An external public search query for the site also returned no results during this check; this is not definitive proof of non-indexing.
- Search volume and keyword difficulty have not been measured. The 55-row keyword map assigns one unique primary keyword and target URL per tool; query-based cannibalization cannot be assessed until Search Console data is available.
- This is a GitHub Pages project site on the shared `github.io` origin. Do **not** add a repository-root `robots.txt` expecting it to control the origin-root crawler policy; it would be served below the project path. No misleading project-path robots file is published.
- Source-level performance checks cover deferred/lazy QR library loading, the absence of remote Google Font imports and existing responsive/mobile regression checks. A live Lighthouse/Core Web Vitals report was not available in this session.
- GitHub Pages deployment is confirmed, but independent live browser rendering of the homepage, directory and sample guides could not be completed because the live site could not be fetched by the available inspection routes. Do not describe that as a successful browser QA.
- The sitemap is published and linked from the site. The connected Windsor.ai Search Console integration is read/report oriented; manual sitemap submission and URL Inspection inside Google Search Console still require the site owner to use the Search Console interface.
- Architecture remains static HTML, CSS, vanilla JavaScript and JSON on GitHub Pages. Zero-cost hosting and no new paid services or project dependencies were introduced.
- Some tools use public CDNs or external APIs. Do not claim every tool is fully offline or that all submitted data stays exclusively on the device.
- `app.js`, `js/tools-data.json`, `tools/index.html`, individual guide pages, `SEO_KEYWORD_MAP.md`, `llms.txt` and `sitemap.xml` must remain synchronized.

## G2 SEO completion status

### G2-A — 55-page SEO audit
- Source-level audit and regression coverage completed for unique titles/descriptions, canonical URLs, one H1, robots directives, static crawlable content, FAQ accuracy/synchronization, structured data and internal links.
- Exact duplicate FAQ questions, steps and feature statements were removed across the shared tool metadata and static guide HTML.
- Remaining external validation limits are recorded above: query-level cannibalization and index status require Search Console data; independent browser rendering and Lighthouse/Core Web Vitals were not available.

### G2-B — Search intent optimization
- The 55-tool keyword map retains one unique primary query theme and canonical target URL per tool, with secondary/long-tail variants and clear boundaries for overlapping tools.
- Tool-specific titles, descriptions, instructions, features, practical notes and FAQs describe the actual supported task. No search-volume or keyword-difficulty figures were invented, and no keyword stuffing was added.

### G2-C — Internal linking
- Homepage and directory provide crawlable discovery paths to all 55 guides.
- Every guide now has at least two unique, active, contextual related-tool links, with automated target validation. Links are not forced to an arbitrary fixed count.

### G2-D — Technical SEO
- Repository-controlled technical work is implemented: canonical and indexability checks, 61-URL sitemap, accurate lastmod dates for changed pages, homepage and directory identity schemas, guide WebApplication/BreadcrumbList/FAQPage schemas, Open Graph/Twitter metadata, mobile/responsive regression coverage and the AI-readable catalogue.
- A project-path `robots.txt` was intentionally not added because it cannot control the shared host's origin-root crawler policy.
- External crawler discovery, Search Console sitemap submission, indexing, rankings, AI citations and live performance measurements remain outside what a repository change can guarantee.


## G2-A — 55-page SEO audit (initial source audit)

- Automated source checks reviewed all 55 guide pages for titles, descriptions, canonicals, H1, crawlable guide structure, FAQs and structured data.
- All 55 have a unique meta description; the current metadata regression test enforces 110–160 characters and verifies the description matches the shared tool metadata and social descriptions.
- All 55 have exactly one H1, a canonical URL matching the expected guide path, three how-to steps, at least three features, at least three FAQs and a tool-specific practical tip in the shared metadata.
- All 55 have WebApplication, BreadcrumbList and FAQPage JSON-LD. The renderer creates FAQ structured data from the same visible FAQ metadata.
- Primary keyword map: 55 rows, consecutive numbering 1–55, unique primary keywords and unique matching guide URLs. Search volume and difficulty remain explicitly unmeasured.
- Initial internal-link follow-up: expand the related-tool navigation on PDF Splitter and selected PDF guides where the current number of cross-guide links is low; keep links relevant and catalogue-valid.
- Minor sitemap housekeeping: review `lastmod` for the ten PR #104 guide updates.
- Remaining audit limits: actual Search Console query overlap, indexing and traffic cannot be evaluated while the property returns no rows; browser-rendered mobile/performance checks and exhaustive claim-to-runtime verification are separate follow-up checks.

## Phase C3 — Final quality and production audit

- Audit baseline: `0cf3d8bc3a00c34743e0c42186f1a94a7a75de9b` on `main`; Phase C3 release commit: `18cda0ea59719cef70fe0d206c277fd892cc45f6`.
- Verified repository tree completeness (192 entries; no truncated tree response), the 55-tool catalogue, 55 individual guide pages, 57 sitemap URLs, homepage metadata, directory/catalogue slug parity, and the release-audit regression coverage.
- Verified the CI workflow checks JavaScript syntax for the active runtime modules and runs the complete `tests/*.test.mjs` suite. Main workflow #470 completed successfully: **156 tests passed, 0 failed**. GitHub Pages deployment #137 completed successfully for the same baseline commit.
- Findings: the production-baseline commit recorded above in the prior state document was stale by one documentation commit; README incorrectly grouped the Phase C1/C2 PDF tools under Phase B2. These documentation issues are corrected in the Phase C3 changes.
- No runtime defect was established by the source/CI audit that justified changing application behavior. Runtime code and the 55-tool catalogue are therefore intentionally unchanged in this documentation-focused remediation.
- Security/privacy review: file processing is performed in the browser for the documented local tools. The URL Shortener sends destination URLs to Spoo.me; IP lookup requests go to `ipwho.is` (IPWHOIS.io); the Forex Currency Converter requests reference rates from `open.er-api.com`. Tailwind, QR/PDF libraries and other browser resources are loaded from public CDNs. Do not describe all tools as fully offline or all data as never leaving the browser.
- Google Search Console property ownership, sitemap submission, indexed-page counts, impressions, clicks, CTR and average position have not been verified from an authenticated Search Console report. Repository tests and public search-result spot checks cannot substitute for that data.
- Limits: CI and GitHub Pages deployment success do not prove visual behavior on every browser/device. Independent real-browser testing of every tool, every file variant, and mobile memory limits remains outside what the automated repository audit can certify.

## SEO follow-up after Phase C3 — sitemap, trust pages and crawl policy (merged and deployed)

- PR #96 (`9ee805cbfaea6fc09f0189df5ea46cf6ca55b918`) corrected malformed escaped whitespace in `sitemap.xml`, aligned the keyword map to 55 guides and added regression coverage.
- PR #97 (`f4d77abce7015b35817f3a11e1e07331ca320169`) added crawlable About, Contact, Privacy and Terms pages, linked them from the homepage and directory, and included them in the sitemap.
- PR #98 briefly added a repository-level `robots.txt`; PR #99 (`69096c6d21387d26ad1f93633152b57db7dd7940`) correctly removed it and removed the misleading test. A GitHub Pages project site under `/online-tools-hub/` cannot publish this repository's file at the host-root `/robots.txt` path. Do not re-add it as a repository-level file.
- Current sitemap inventory: 61 unique canonical URLs (homepage + directory + 55 tool guides + four information/policy pages). The active SEO keyword map remains scoped to the 55 tool-guide pages.
- The latest main regression workflow #490 passed 157/157 tests, and Pages deployment workflow #143 succeeded for commit `69096c6d21387d26ad1f93633152b57db7dd7940`.
- Google Search Console indexing and performance data are still unverified. Obtain actual impressions, clicks, CTR, average position and page/query reports from the authenticated property before choosing content priorities or claiming ranking improvements.

## Phase C0 — Catalogue and documentation cleanup (merged and deployed)

- Feature branch: `feature/phase-c0-catalogue-docs-cleanup`.
- Scope: remove duplicate Phase B2 links from the tool-guide directory, remove the retired Universal Doc Formatter entry from README, and add regression coverage for directory uniqueness and retired-tool documentation.
- SEO keyword map audit found all 54 active slugs represented in its 54 primary-keyword rows; repeated URLs in its keyword-ownership cross-reference table are intentional. No SEO keyword-map rewrite is required.
- PR #92: https://github.com/apex-global-labs/online-tools-hub/pull/92 was squash-merged at `bb142624c26aae95fefe4778a1d5f4ace8ca6442`.
- PR regression workflow #457 passed 152/152 tests. Post-merge main workflow #458 passed, and Pages deployment #135 succeeded.
- The directory now contains exactly 54 links for 54 unique active slugs. README no longer advertises the retired Universal Doc Formatter.
- Phase C0 changes are now in production after the owner approved the merge. The duplicated directory entries are removed and README no longer advertises the retired formatter.

## Phase A — Three PDF utilities added (merged and deployed; owner-reported browser QA successful)

- New tools: PDF to JPG / PNG, PDF Text Extractor, and PDF Watermark & Page Number.
- PDF.js 3.11.174 is loaded on demand for page previews, image rendering and selectable-text extraction; pdf-lib 1.17.1 is loaded on demand for PDF modification; JSZip 3.10.1 is loaded only for multi-image downloads.
- Limits: PDF to Image 30 MB / 120 pages / 40 exported pages per job; Text Extractor 25 MB / 200 pages; Watermark 30 MB / 150 pages; optional logo up to 5 MB. Watermark canvas rendering is capped at 16 megapixels per page to reduce mobile memory pressure.
- PDF Text Extractor reads selectable text only. It does not perform OCR on image-only scanned pages; complex multi-column reading order may vary by source PDF.
- Watermark text and logos are rendered as a transparent canvas overlay. Non-Latin glyph appearance depends on fonts available in the visitor's browser.
- No backend, paid API or document upload endpoint added. PDF files are processed locally; PDF.js, pdf-lib and JSZip libraries are loaded from public CDNs when needed.
- PR #84 was squash-merged into `main` at `d8ae533938e45d36ad9df519b72a7ce4800628f7`; its regression workflow **41211319136** passed **136 tests, 136 passed, 0 failed**, and Pages deployment workflow **41211355679** succeeded.
- PR #86 was squash-merged into `main` at `f7a11fdeb4354e010d9de45208eb18603da3ec70`; its follow-up regression workflow **41211595615** passed **138 tests, 138 passed, 0 failed**, including JavaScript syntax checks.
- Post-merge main regression workflow **41211622198** also passed **138 tests, 138 passed, 0 failed**.
- Independent real-browser QA with representative PDFs, output files and mobile devices remains pending. CI and deployment success do not prove every PDF variant works on every browser/device.

## Phase B1 — ZIP File Manager and Favicon Generator (merged; owner-reported browser QA successful)

- PR #88 was squash-merged into `main` at `3f68a6715af29bf2b4e42bb70a6a6d3691b2253a` after the owner confirmed successful desktop/mobile browser testing and authorized the merge.
- Production catalogue baseline after merge: 49 unique tools, 49 individual guide pages and 51 sitemap URLs.
- ZIP File Manager supports local ZIP creation and selected-entry extraction with strict archive/path/size limits. Password-protected ZIP archives are unsupported.
- Favicon Generator accepts PNG/JPEG/WebP and exports common PNG sizes, a PNG-based ICO and HTML snippet. Both tools process files locally; JSZip is loaded on demand from a public CDN.
- CI run #415 passed 145/145 tests and syntax checks. The owner separately confirmed real Browser QA success; this is owner-reported, not an independently observed test in this session.

## Phase B2 — Five core utilities (merged; CI, GitHub Pages deployment and owner-reported browser QA successful)

- PR #89 was squash-merged into `main` at `9cce81e28a90dd859076933d5f5bcb7a3496e7b6`.
- Catalogue: 54 unique tools, 54 individual guide pages and 56 sitemap URLs.
- Added PDF Page Organizer, Text Sorter, Find & Replace, JWT Decoder and XML Formatter. Homepage metadata/search, app catalogue, JSON router metadata, directory, sitemap, SEO keyword map and guides are synchronized.
- PDF Page Organizer uses pdf-lib loaded on demand; it reorders every page using a complete page sequence and optionally rotates every page. Limits: 30 MB and 300 pages.
- Text Sorter supports alphabetical and numeric ordering with case and blank-line options. Find & Replace supports first/all literal matches, case-sensitive and whole-word options. JWT Decoder locally decodes header/payload only and does not verify signatures. XML Formatter uses the browser XML parser and serializer.
- No paid API, backend, token upload or ToolNest file-upload endpoint was added. PDF processing remains local; pdf-lib is loaded from a public CDN on demand.
- GitHub Actions run **41218042778** (run #445) passed **150 tests, 150 passed, 0 failed**, including JavaScript syntax checks.
- Post-merge integration commits **8722af8** and **1e89355** connect PDF Page Organizer to universal Copy / Download / Clear actions. Commit **697b361** corrects the B2 module script to load as an ES module before `app.js`.
- GitHub Pages build and deployment run **41218210886** (run #132) completed successfully on 2026-10-31 at 16:09:05 UTC after the latest main-branch update.
- The owner confirmed successful browser checks after deployment. This is owner-reported QA, not an independently repeated browser session in this audit.
## Retired tools

- Two Bangla text utilities have been permanently removed from the active catalogue, application workspace, router compatibility handling, dedicated assets, SEO guides, directory, sitemap and tool-specific tests.
- Their dedicated runtime modules and styles were isolated from the other tools. The bundled dictionary assets were exclusive to the retired text-cleanup implementation and have been removed with it.
- Legacy hash routes for the retired tools resolve to the standard not-found state. No redirect or compatibility fallback is retained.

## Repository and production baseline

- Repository: https://github.com/apex-global-labs/online-tools-hub
- Live site: https://apex-global-labs.github.io/online-tools-hub/
- Production branch: `main`
- Latest verified main-branch code commit: `ffa23bfadb096e10f19982799cb2f2f1589f56cf` (catalogue baseline sync).
- Architecture: static HTML, CSS and vanilla JavaScript on GitHub Pages; no application backend or build step.
- Catalogue: **54 unique tools**, **54 individual SEO guide pages**, and **56 sitemap URLs** (homepage + directory + 54 guides).
- `app.js`, `js/tools-data.json`, the tool-guide directory and sitemap are expected to remain synchronized.
- No paid service or ToolNest backend is used. Some tools rely on third-party browser libraries or public APIs.

## Responsive sidebar/content workspace layout (2026-10-31)

- PR #70 was squash-merged into `main` at `b0671360ffc5ac0a1326479cf4b7da8fa0bc9a95`.
- Replaced the earlier fixed overlay approach with a semantic workspace outside the homepage's constrained `<main>`: an `<aside>` for branding, breadcrumb, tool details and return navigation, plus a `<main>` for tool controls and results.
- Desktop uses CSS Grid with a bounded sidebar and flexible content column. Mobile switches to a stacked single-column layout.
- Previous homepage, header, footer and marquee are hidden while a tool is active. Sidebar and tool content have constrained independent scrolling; `min-width: 0` / `min-height: 0` prevent grid overflow and clipping.
- Added `tests/workspace-grid-layout.test.mjs` for semantic structure, desktop grid, independent scrolling, responsive breakpoints and existing open/close behavior.
- Regression workflow **41181389281** passed: **123 tests, 123 passed, 0 failed**; JavaScript syntax check passed.
- Live Pages deployment and real-browser visual QA remain to be independently confirmed. Verify at desktop, tablet and mobile widths, including long forms, page scroll, return navigation and browser Back.

## Full-screen tool workspace update (2026-10-31)

- PR #68 was squash-merged into `main` at `dbb657f9a6ad37368b5b4a151d8e7bca6d1aa930`.
- All 44 tools use the shared full-screen workspace. The workspace is fixed to the viewport, has its own vertical scrolling, and covers the previous homepage content.
- The welcome marquee, site header and footer are hidden while a tool is active. Background page scrolling is locked and restored when the visitor closes the tool or navigates back.
- The same full-screen treatment applies to unknown-tool routes. Light/dark appearance follows the existing theme variables.
- Added `tests/fullscreen-tool-workspace.test.mjs`; PR regression workflow **41180197356** passed: **118 tests, 118 passed, 0 failed**, including JavaScript syntax checks.
- GitHub Pages post-merge deployment and independent real-browser visual verification have not yet been confirmed. Required visual QA: open multiple tool types, confirm no previous page/header/footer is visible, test workspace scrolling, close via All Tools/Escape/browser Back, verify theme, and repeat on a narrow mobile viewport.

## Phase 8A — Image to PDF (merged; live-browser QA pending)

- PR #66 was squash-merged into `main` at commit `820ee1659d08dfd4224b4ae7883491ebc5e36011`.
- Added the 44th tool, **Image to PDF**, with a dedicated workspace, browser-side processing module, responsive stylesheet and standalone SEO guide.
- Supports multiple PNG/JPEG images, page reordering/removal, A4 / US Letter / US Legal paper, automatic / portrait / landscape orientation, 0 / 10 / 20 mm margins, PDF preview, download and clear.
- Uses the existing `pdf-lib@1.17.1` dependency, loaded lazily from a public CDN. No new dependency, paid API or ToolNest upload endpoint was introduced. Selected image bytes are processed in the browser.
- Limits: up to 20 images, 15 MB per image, 60 MB combined, 40 megapixels per image and 100 megapixels per job. Device memory can still constrain large jobs.
- SEO integration: unique title/description/canonical URL, social metadata, WebApplication / BreadcrumbList / FAQPage structured data, visible guide content, directory link, sitemap URL and keyword-map row.
- PR regression workflow **41179208669** completed successfully: **114 tests, 114 passed, 0 failed**; JavaScript syntax checks passed, including `js/image-to-pdf.js`.
- The PR was merged after reviewing the implementation and passing CI. Post-merge GitHub Pages publication and real-browser visual QA have not been independently confirmed here. Do not describe the live tool as browser-verified until the owner tests it.
- Required browser QA: upload several PNG/JPG images, reorder and remove pages, test each page size/orientation/margin combination, create and preview the PDF, download and open it, test transparent PNG behavior, clear/reopen the tool, and repeat on a mobile browser.

## Current three-phase UX update (2026-10-31)

- Phase 1: Escape closes the active workspace; URL Shortener accepts public website domains without a scheme and normalizes them to HTTPS. PR #59 regression run #190 passed.
- Phase 2: compacted the homepage hero, added seven popular quick-pick cards, category symbols, and a 14px English welcome marquee. PR #60 regression run #192 passed. Visual browser/device QA remains to be confirmed by the site owner; CI does not verify visual rendering.
- Phase 3: tool cards are sorted by a curated general-demand heuristic and display Hot / High / Medium / Normal labels. These tiers are not measured from ToolNest usage analytics or an independently verified global usage dataset.

## Deep audit remediation — URL Shortener and project-state record (2026-10-31)

- Verified homepage baseline `main` at `fdf3f2546c21bbba5c8346030a21f28ab98e6224`. PR #62 merged at `e855cb5943d78f37d97c871d16f5298b80016581`; PR #63 merged at that homepage baseline. Their scope was the sticky welcome marquee/header positioning and homepage stylesheet cache key.
- Post-merge `main` regression workflow **41173495989** completed successfully. GitHub Pages build/deployment workflow **41173494784** completed successfully for `fdf3f2546c21bbba5c8346030a21f28ab98e6224`. This confirms the Pages workflow reported success; it is not an independent real-browser visual check.
- Deep audit Finding 1: URL Shortener hostname validation did not fully cover IPv6 loopback, IPv6 unique-local/link-local, IPv4 link-local, CGNAT and IPv4-mapped IPv6 forms. Remediation is being delivered in PR #64 on branch `fix/url-shortener-private-ip-validation`.
- PR #64 updated `js/url-shortener.js` and `tests/url-shortener.test.mjs`. Final PR regression run **41176068456** completed successfully: JavaScript syntax-check step PASS and complete repository regression-test step PASS. Targeted local URL Shortener tests passed **6/6**.
- The URL is validated before it is submitted to Spoo.me. ToolNest does not fetch the destination URL itself; describe this as URL input validation, not an SSRF vulnerability.
- Finding 2 — reduced-motion marquee text visibility — was explicitly excluded by the project owner. Do not change its CSS, markup or behavior as part of this remediation.
- Finding 3 — this project-state documentation update — is included in PR #64. Historical phase records below are retained; this current status section supersedes stale production-baseline wording.
- PR #64 was squash-merged into `main` at `78b260df82ad5ab16866ca635b620055f9b9af4e` after CI PASS and code review. Post-merge `main` regression workflow **41176112027** completed successfully. GitHub Pages build/deployment workflow **41176111922** completed successfully for the merge commit. The deployment workflow confirms publication completed; it does not replace real-browser visual verification.
- Manual live-browser visual verification has not been independently performed in this remediation. Do not report visual QA as passed based only on CI or the Pages deployment workflow.
## QA-1 / QA-2 — Release verification record (2026-10-31)

- QA-1 repository checks on the PR #56 merge commit confirmed 43 unique tool metadata records, 43 matching guide pages, and 45 unique sitemap URLs; no missing or duplicate tool slugs were found.
- The owner reports that live-browser verification has been completed. The exact browser test cases, devices, and pass/fail results were not itemized in the project handover; do not interpret this as proof that every one of the 43 tools or every edge case was tested.
- The assistant did not independently run a real-browser automation session. GitHub Actions regression success and Pages deployment success are separate from manual browser verification.
- The QA-1/QA-2 documentation record was merged through PR #57 at `f6b24e20f2b7ed73aa83b37d9f50a01080a9a01e`; its PR-triggered regression workflow run #186 completed successfully. This documentation-only merge changed no site runtime files or deployment assets; no separate post-merge run is claimed here.
- QA-2 source audit found Tailwind utility classes in both `index.html` and `app.js` (204 distinct class tokens in the inspected class/className attributes). The Tailwind CDN must not be removed until a locally generated stylesheet covers the required utilities and responsive variants and is visually checked; otherwise layout regressions are likely.
- The root `style.css` contains repeated selectors used as later cascade overrides, but the audit found no identical selector-and-declaration block repeated verbatim. No CSS rules were deleted because their ordering may be intentional.
- No application runtime code or styles were changed by this QA documentation update. A safe Tailwind self-hosting/build migration remains a separate optimization task requiring CSS coverage and browser regression checks.

## Phase 8C — Free URL Shortener (merged and deployed)

- PR #55 was squash-merged into `main` at commit `5d2293eca435def260a5102519c61eb602f6b65f` on 2026-10-31.
- Added the 43rd tool: **URL Shortener**, with optional custom alias, short-link output, copy/open actions, URL validation and clear action.
- The static GitHub Pages site has no backend. Link creation is delegated directly from the visitor's browser to Spoo.me's free anonymous shortening endpoint; ToolNest does not store the submitted destination URL.
- Spoo.me's documented anonymous limits at implementation time were 20 requests per minute and 1,000 per day. No API key is required for anonymous shortening; anonymous links are not attached to an account and cannot be managed later through the API. Provider terms, limits and availability may change.
- Short links use the provider's domain, not a ToolNest-branded domain. Own-domain redirects, link management and analytics are not included.
- The feature includes a dedicated SEO guide, directory and sitemap entries, keyword-map row, regression tests and user-facing third-party-processing disclosure.
- The owner confirmed the deployed URL Shortener works. This is owner-reported live verification, not an independently repeated browser/API test in this audit.
- GitHub Actions regression workflow run #181 completed successfully with 105 tests passing. A follow-up audit found that its syntax-check list omitted `js/url-shortener.js`; PR #56 corrected this by adding `node --check js/url-shortener.js` to `.github/workflows/tests.yml`. PR #56 was merged into `main` at `b7f9855bddf19853d6700775a072eefce89a3693` on 2026-10-31. Its regression workflow run #185 and GitHub Pages deployment run #89 both completed successfully.

## Phase 8B — PDF Splitter (merged and deployed; live browser verification pending)

- PR #53 merged into `main` at production commit `6f63d13955aaff18f84c0ecd60b215e6276f5286`.
- Added the 42nd tool, **PDF Splitter**, with a dedicated responsive workspace, browser-side processing module and standalone SEO guide.
- Features: upload one PDF, select individual pages, apply ranges such as `1-3,5`, export each selected page as its own PDF, and download multiple outputs together as a ZIP archive. One output downloads directly as a PDF.
- Uses the existing `pdf-lib@1.17.1` dependency and lazy-loads JSZip only when multiple outputs need a ZIP. PDF documents are not uploaded to ToolNest; there is no backend or paid service.
- Safety limits: 30 MB per input PDF and 300 pages per job. Large documents may still be constrained by device memory.
- SEO integration: unique title and meta description, Open Graph/Twitter metadata, WebApplication/BreadcrumbList/FAQPage structured data, three visible FAQs, directory link, sitemap entry and keyword-map row.
- Catalogue after merge: **42 tools**, **42 individual SEO guides**, **44 sitemap URLs**.
- PR CI workflow **41118335314** passed: **101 tests, 101 passed, 0 failed**; JavaScript syntax checks passed including `js/pdf-splitter.js`.
- Post-merge `main` regression workflow **41118407200** passed: **101 tests, 101 passed, 0 failed**.
- GitHub Pages build and deployment workflow **41118406061** completed successfully for commit `6f63d13955aaff18f84c0ecd60b215e6276f5286`.
- **Manual live-browser verification remains pending:** test page selection, range extraction, single-PDF download, multi-output ZIP integrity, and Android memory behavior with real PDF files. Do not mark every feature browser-verified until these checks are performed.

## Phase 8A — Advanced PDF Merger (merged and deployed; owner-reported live check passed)

- PR #51 merged into `main` at commit `7a514e47f115ef07c91d25979d9085d38a791c09`.
- Added the 41st tool, **Advanced PDF Merger**, with a dedicated workspace and responsive styling.
- Browser-side PDF processing uses `pdf-lib@1.17.1`, loaded on demand from unpkg. PDF files are not sent to the ToolNest server by this module.
- Features: multi-file selection and drag-and-drop; reorder files; select or deselect individual pages; apply page ranges such as `1-3,5`; reorder pages; rotate individual pages by 90-degree steps; merge selected pages and download one PDF. Selecting pages from a single PDF can create a new PDF containing only those pages.
- Safety limits: up to 20 files, 50 MB per file, 200 MB total, 500 pages per file and 2,000 pages per merge job. Invalid file signatures, damaged PDFs and password-protected PDFs may be rejected.
- Added `tools/advanced-pdf-merger/index.html`, a directory link, a sitemap entry and a dedicated keyword-map row. The sitemap now contains **43 canonical URLs**: homepage + directory + 41 tool guides.
- Regression workflow **41115562344** completed successfully: **93 tests passed, 0 failed**; JavaScript syntax checks passed, including `js/pdf-merge.js`.
- GitHub Pages deployment workflow **41115562715** completed successfully for the merge commit.
- **Live verification:** the owner reports manually testing the deployed tool and confirming that it works. The exact test cases and devices were not recorded; further edge-case QA (large files, password-protected PDFs, mobile memory limits and downloaded-file reopening) remains advisable.
- Not included in this sub-phase: standalone per-page export (added as PDF Splitter in Phase 8B), PDF thumbnails, Image to PDF, PDF to Image, PDF to Word and Word to PDF. These remain candidates for subsequent Phase 8 work.

## Phase 7 — Speed & Performance SEO (completed and deployed)

- PR #49 merged into `main` at commit `79f13736744aa6a8e6af2e5dd387fc8585cc8768`.
- Regression workflow **41105519466** completed successfully: **91 tests passed, 0 failed**; JavaScript syntax checks passed.
- GitHub Pages deployment workflow **41106153259** completed successfully for the Phase 7 merge commit.
- QR Code Styling is no longer downloaded on every initial page visit; it is loaded asynchronously on demand when the QR tool needs it.
- Removed the remote Google Fonts CSS import from the main stylesheet and retained the system-font fallback stack.
- The user reviewed the live site and the supplied PageSpeed Insights page and confirmed that everything looked okay. Exact Mobile/Desktop scores were not provided in the project record, so no numeric score or before/after improvement is claimed.
- CrUX field Core Web Vitals values were not independently captured. Treat numeric PSI/CWV reporting as a future measurement follow-up, not as a claimed result of this phase.
- Phase acceptance is based on the merged optimization, passing regression suite, successful production deployment, and user-reported live review.

## Phase 2 — Technical SEO Fix (completed and deployed)

- PR #41 merged into `main` at commit `016513e746d7e5420706a90cab3717fd07780c80`.
- Corrected crawl documentation and clarified why a repository-level `robots.txt` is not published for this path-prefixed GitHub Pages project site.
- Verified regression tests and GitHub Pages build/deployment both completed successfully for the merge commit.
- This phase changed documentation and regression coverage; it did not yet create independent crawlable tool pages.

## Phase 16 — Standalone IP Tools module (merged)

- IP Address Finder & Lookup was added through PR #37; the IP special-use classification correction was merged through PR #38.
- Supports public IPv4/IPv6 lookup and Find My IP, local input validation, private/special-use range checks, approximate geolocation, ISP, organization, ASN and timezone fields when supplied by the provider.
- The queried IP is sent directly from the visitor's browser to IPWHOIS.io. ToolNest does not proxy the request through its own server or intentionally store the lookup input. The provider may process request data under its own policy.
- Location and coordinates are approximate network estimates, not a home address or exact GPS location. The free endpoint does not provide VPN/proxy/Tor detection.
- PR #38 regression workflow **41045882806** passed: **72 tests, 72 passed, 0 failed**.
- Latest `main` regression workflow **41045986360** completed successfully.
- Latest GitHub Pages build/deployment workflow **41045986248** completed successfully for the same main commit.
- Live visual and interaction checks still require real-browser verification.

## Phase 17 — Final QA & Release Audit (completed and merged)

- Merged into `main` via PR #39; production baseline is commit `a893cf9507146544d4da5b602854c1a20db5cf15`.
- Scope: final release audit and low-risk fixes only; no new utility tools.
- Initial findings and branch changes:
  1. The production page loads `js/ip-tools.js` and `js/router-bridge.js`, but neither file had a dedicated CI syntax check. A new release-audit test runs Node syntax checks for both and is included in the existing `tests/*.test.mjs` suite.
  2. The homepage description did not describe the complete 40-tool catalogue, and canonical/Open Graph/Twitter metadata were absent. These have been added.
  3. A sitemap was absent. A canonical homepage sitemap is now added. A repository-level `robots.txt` was deliberately omitted: this GitHub Pages project site is path-prefixed, so a file in the repository cannot serve the origin-root robots path crawlers expect.
  4. The previous project-state summary incorrectly described Phase 14 / 36 tools as the current production release. This authoritative section supersedes that historical text.
- The complete Phase 17 change list is recorded in PR #39.
- The existing GitHub Actions workflow now syntax-checks `js/ip-tools.js` and `js/router-bridge.js`; its existing test command automatically discovers the new release-audit test file.
- PR #39 regression workflow **41049822027** passed: **75 tests, 75 passed, 0 failed**; JavaScript syntax checks passed. GitHub Pages deployment for these changes will occur only after merge.
- Manual browser verification is still required for representative tools, IP lookups, image previews/downloads, QR scanability, Copy/Clear behavior, routes, responsive layouts, themes and browser-console/network errors.
- Do not describe the project as fully browser-QA-passed until those checks have actually been completed.

## Phase 3 — Individual Crawlable Tool Pages (completed and deployed)

- PR #42 merged into `main` at commit `0c36bde797deaa9d1bf97fab7cc76d5f377b0482`.
- Added **40 individual static HTML tool-guide pages** under `tools/<slug>/` plus the `tools/` directory page.
- Each guide includes a unique page title, meta description, canonical URL, Open Graph/Twitter title and description, visible how-to instructions, key features, FAQs, and WebApplication/BreadcrumbList/FAQPage structured data.
- Added a homepage discovery link to the guide directory. Each guide links to its existing interactive tool workspace through the current hash router; tool implementations were not duplicated or replaced.
- Updated `sitemap.xml` to **42 unique URLs**: homepage + tool directory + 40 individual guides. A source/tree audit confirmed all 40 guide files are represented in the sitemap.
- Verification:
  - Phase 3 PR regression workflow **41095180965**: success.
  - Post-merge `main` regression workflow **41095307954**: success.
  - GitHub Pages build/deployment workflow **41095305191**: success for the Phase 3 merge commit.
  - Repository source audit: 40 guide HTML files, 42 unique sitemap URLs, all 40 guide URLs resolve to a corresponding repository file.
- **Manual real-browser verification remains pending.** The project has no active automated browser E2E suite; verify representative guide URLs, mobile layout, internal links and tool launch in a real browser before claiming browser QA complete.
- Sitemap inclusion does not guarantee Google indexing, search visibility or rankings. Search Console indexing status has not yet been confirmed.

## SEO Phase 5 — Keyword Research & Search Intent Mapping (completed and merged)

- PR #46 merged into `main` at commit `2a70024660607d57d59efb3f533129d9a9a03027`; source changes are now part of the production branch.
- Added `SEO_KEYWORD_MAP.md` covering all 40 existing tool-guide pages: one distinct primary keyword and exact target URL per guide, secondary terms, long-tail query ideas, inferred search intent, editorial priority and page-specific content guidance.
- Documented close-topic ownership boundaries to reduce keyword cannibalization across converters, image operations, Base64 directions, text tools, date/time tools and crawler files.
- Research is qualitative. Search volume and keyword difficulty are explicitly **not measured**; no unsupported numeric estimates are used. Revisit priorities with actual Search Console query data as it becomes available.
- Added `tests/seo-keyword-map.test.mjs` to verify 40 rows, unique primary keywords, unique target URLs, exact slug-to-URL mapping, research caveats and cannibalization guidance.
- PR regression workflow **41100077523** completed successfully (**success**).
- The change is documentation and test-only; it does not alter runtime code, tool behavior, canonical URLs, router or sitemap. A new Pages deployment is not required to publish the keyword research document to the repository, and no new deployment is claimed for this phase.
- Manual browser QA and Search Console indexing/performance checks remain separate follow-up tasks; this phase's completion does not imply that Google has indexed the pages or that rankings/traffic have improved.

## SEO Phase 6 — Sitemap & Crawling Optimization (implementation complete; external validation pending)

- Audited the existing production sitemap, homepage discovery link, tool-guide directory and representative individual guide pages before making changes.
- The existing sitemap already contains 42 unique canonical URLs: homepage, tool directory and all 40 static tool guides. Hash-based interactive workspace URLs are intentionally excluded.
- The project-site path is `/online-tools-hub/`; a repository-root `robots.txt` cannot publish the origin-root robots policy expected by crawlers. The existing documentation correctly records this GitHub Pages limitation. No misleading or ineffective robots file was added.
- Added `tests/seo-crawl-integrity.test.mjs` to enforce exact sitemap coverage, unique canonical URLs, repository file existence, index/follow directives, one H1 per guide, homepage/directory discovery links and guide-to-workspace links.
- Regression workflow passed: Node regression tests completed successfully on 2026-10-30 at 18:00 UTC.
- PR #48 was reviewed and squash-merged into `main` at commit `c6ab61ecd51e6dbe093f092cd54bd68ba12668b2` on 2026-10-30 at 18:01:30 UTC.
- Source-code implementation and automated verification are complete. Search Console sitemap submission, indexing status and live HTTP/browser verification remain separate follow-up checks; repository tests cannot establish Google indexing or external crawler access.

## Phase 4 — On-Page SEO Optimization (completed and deployed)

- PR #44 merged into `main` at commit `bb200c3a12d797333d87e36fe864ffec09b46249`.
- Rewrote the meta descriptions for all 40 tools with distinct, natural, page-specific summaries (121–142 characters); synchronized each description across the source catalogue, HTML meta description, Open Graph, Twitter and WebApplication JSON-LD.
- Added one practical, tool-specific usage/safety/accuracy tip to each of the 40 static guides; retained the existing how-to steps, features, visible FAQs, FAQ structured data, canonical URLs and related-tool links.
- Replaced repeated generic hero copy with each tool's concise functional description.
- Corrected the homepage heading hierarchy: the dynamic workspace title is now H2, leaving the homepage hero as its single primary H1.
- Improved the tool-directory description and social preview metadata.
- Added regression coverage for unique concise metadata, social description consistency, practical tips, exactly one H1 per guide, FAQ visibility and image alt text when images are present.
- Regression workflow **41098514104** completed successfully: **82 tests, 82 passed, 0 failed**; JavaScript syntax checks passed.
- GitHub Pages build and deployment workflow **41098513156** completed successfully for the Phase 4 merge commit.
- Source review confirmed all 40 static guide pages have synchronized unique metadata and visible practical tips; tool URLs, router behavior, canonical URLs and sitemap entries were retained.
- Manual browser verification and Search Console indexing checks remain separate follow-up tasks.

## Phase 7 — Speed & Performance SEO (completed; quantitative metrics not recorded)

- Implementation details and verified CI/deployment evidence are summarized in the authoritative Phase 7 status above.
- The user reviewed the live site and PageSpeed Insights page and reported that everything looked okay; exact Mobile/Desktop score values were not supplied.
- No numeric PageSpeed score improvement or independently measured CrUX field Core Web Vitals result is claimed.

## Current application structure

- `index.html`: homepage, navigation, search, tool grid and workspace.
- `app.js`: catalogue, tool rendering, interactions and tool implementations.
- `js/tools-data.json`: 55 tool metadata records, descriptions, routes and per-tool SEO content.
- `js/router.js` and `js/router-bridge.js`: modern hash routes and legacy route compatibility.
- `js/ip-tools.js` / `css/ip-tools.css`: IP validation, special-use classification and lookup presentation.
- `js/pdf-merge.js` / `css/pdf-merge.css`: on-demand browser-side PDF merging, page selection/order/rotation and responsive controls.
- `js/pdf-splitter.js` / `css/pdf-splitter.css`: browser-side page extraction, individual PDF exports and ZIP downloads.
- `js/phase15-developer-seo.js`: local robots.txt, XML sitemap and CSS gradient generators.
- `js/advanced-converters.js`, `js/finance-calculators.js`: reusable converter and calculator helpers.
- `js/seo-content.js`: tool guides, FAQs and dynamic FAQPage JSON-LD.
- `tests/`: Node regression tests run by GitHub Actions.
- `tools/`: static SEO guide directory and 55 individual crawlable tool pages.
- Root-level `about/`, `contact/`, `privacy/` and `terms/`: separate crawlable information/policy pages.
- `sitemap.xml`: 61 canonical URLs (homepage, directory, 55 tool guides and four information/policy pages); no repository-level `robots.txt` is published because this is a path-prefixed GitHub Pages project site.

## Known limitations and release cautions

- No automated real-browser end-to-end suite is currently part of the active CI workflow. A historical browser-test PR exists but is not merged; do not assume it runs.
- Interactive tool workspaces continue to use hash-based routes; static SEO guide pages are separate HTML documents and link to the corresponding interactive workspace.
- Third-party browser resources include Tailwind, QR/PDF libraries and other CDNs. Currency conversion, IP lookup and URL shortening call external services; those tools are not fully offline.
- Search Console impressions, clicks, CTR, average position and actual indexed-page counts are not available in the repository and must be measured from the authenticated Google Search Console property.
- IP geolocation is approximate and depends on the external provider's availability and data coverage.
- QR image blending can reduce scan reliability; exported QR images should be scan-tested.
- Phase 4 Escape-key workspace issue remains deferred. Search suggestion Escape handling is a separate behavior.
- Tailwind's browser CDN is convenient for the current free static setup but is not an optimized compiled production asset.

## Safe-change rules

- Keep GitHub Pages hosting and the no-paid-service approach.
- Work on a feature branch; do not edit `main` directly.
- Run automated tests and syntax checks before opening a PR.
- Merge only after reviewing the PR diff and successful required checks.
- Separate source-level, CI, deployment and real-browser verification claims.

---

## Historical phase notes

The remaining sections below preserve earlier phase decisions and implementation history. Any older tool counts, deployment states, roadmaps or pending/completed labels are historical and are superseded by the authoritative status above.

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


## Standalone IP Tools module — 2026-10-30
- Work branch: `feature/advanced-ip-tools`; merged into `main` through PR #37.
- Adds one dedicated `IP Address Finder & Lookup` utility; no other Phase 16 tools are included.
- Supports public IPv4/IPv6 lookups and a Find My IP action, with input validation, local private/special-use range checks, approximate geolocation, ISP, organization, ASN and timezone fields when returned by the provider.
- Uses the IPWHOIS.io free HTTPS endpoint with an explicit `fields` allowlist. Provider documentation states 1,000 requests/day per website domain and commercial use is allowed; the free tier does not include VPN/proxy/Tor security flags and has no uptime SLA.
- Privacy: browser sends the queried IP directly to IPWHOIS.io; ToolNest does not proxy it through its own server or intentionally store it. The provider may process request data under its own policy. A private/special-use address is detected locally and is not sent for geolocation.
- Accuracy: city/postal/coordinates are approximate network estimates only; no household, street-address or exact GPS claims.
- Adds helper validation tests and updates prior hard-coded catalogue-count regression expectations from 39 to 40.
- Merge: PR #37 — https://github.com/apex-global-labs/online-tools-hub/pull/37; squash merge commit `e435fd6c35d4f62f538e2172a97999fa5e5f7a32`.
- Initial IP Tools regression workflow #41045292098 passed: 70/70 tests. A follow-up code review found an overly broad IPv4 special-use range check that could incorrectly block some addresses.
- Corrected through PR #38 — https://github.com/apex-global-labs/online-tools-hub/pull/38; squash merge commit `1e277d5b093acc0041bb8673fd68495caf9e3056`. IPv4 special-use classification now uses exact CIDR boundaries and IPv4-mapped IPv6 addresses inherit the embedded IPv4 special-use check.
- Follow-up regression workflow #41045882806 passed: **72 tests, 72 passed, 0 failed**; JavaScript syntax checks passed.
- Production baseline: main catalog and router metadata both contain 40 unique tools; `ip-tools` route and IP helper/style assets are present on main.
- Deployment/live QA: GitHub Pages deployment and real-browser interaction could not be independently verified in this session. The live-site fetch was unavailable. Do not claim the feature is visibly live until the site is checked in a browser.
- Manual browser QA still recommended: Find My IP; public IPv4 and IPv6 lookup; invalid/hostname input; private/special-use IP rejection without API request; Copy/Download/Clear; mobile and desktop layouts; day/night themes; console/network errors.


## Phase 2 — Technical SEO Fix (work in progress)
- Work branch: `seo/phase2-technical-seo-fixes`; based on the Phase 17 production baseline above.
- Corrected the README crawl-file documentation: removed the duplicate heading and the inaccurate claim that a repository-level `robots.txt` exists.
- Documented why a project-site repository cannot provide the host-root `robots.txt` endpoint, why hash-based tool routes are not separate sitemap URLs, and that a social preview image is not configured yet.
- Added a regression test to prevent the crawl documentation from becoming contradictory again.
- The homepage's existing title, meta description, canonical URL, Open Graph and Twitter text metadata were retained; no unverified social-image URL or ineffective project-subpath robots file was added.
- Individual crawlable tool pages and their sitemap entries remain Phase 3 work. Do not add hash-fragment URLs to the sitemap.
- CI and PR review are pending. No production deployment has occurred from this branch.



## Phase C1 + C2 — PDF Page Organizer UX and PDF Images Extractor (merged and deployed)

- Owner authorized both phases together, including merge permission.
- Phase C1 upgrades PDF Page Organizer with page thumbnails, desktop drag-and-drop reordering, accessible move-up/move-down controls for mobile, editable page order and existing global rotation. Files remain local; limits: 30 MB / 300 pages.
- Phase C2 adds PDF Images Extractor for supported embedded raster image objects, preview cards, individual downloads and ZIP export. It is not OCR and does not promise extraction of every unusual image mask/encoding. Limits: 25 MB / 200 pages.
- PDF.js 3.11.174, pdf-lib 1.17.1 and JSZip 3.10.1 load from public CDNs on demand; no backend, upload endpoint or paid service is introduced.
- Catalogue metadata, app workspace wiring, standalone SEO guide, directory, sitemap, README, syntax workflow and regression tests are updated together.
- PR #93: https://github.com/apex-global-labs/online-tools-hub/pull/93 was squash-merged at `c7d9a767005f188b2df6567645bf9d5bc7bcc6d3`.
- PR regression workflow #468 passed **156/156 tests**; post-merge main workflow #469 passed **156/156 tests**; Pages deployment #136 succeeded.
- Live browser QA using representative PDFs on desktop and mobile has not been independently performed in this session; the owner should confirm drag/drop, mobile move buttons, extracted-image correctness and downloads with real files.
