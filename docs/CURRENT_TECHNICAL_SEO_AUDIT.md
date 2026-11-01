# ToolNest — Current Technical SEO and Crawlability Audit

Audit date: 2026-11-01  
Repository: https://github.com/apex-global-labs/online-tools-hub  
Production baseline: main at 55e8713b7b0b209611043f5b482eefd9f77c1120  
Audit type: source and repository inspection. This is not a live-browser, Search Console, Lighthouse or AdSense certification.

## Executive summary

The current repository contains 55 active tools, 55 individual static guide pages and 61 canonical URLs in the XML sitemap. The sitemap inventory consists of the homepage, the tool directory, all 55 guides, and About, Contact, Privacy and Terms pages. The directory and guides provide static HTML discovery paths; interactive workspaces continue to use hash routes on the homepage.

The main repository-level tasks are to keep this inventory synchronized, ensure every sitemap URL has a matching canonical, and preserve crawlable internal links. G4 adds automated regression checks for these invariants. Search indexing, ranking, traffic, browser rendering and Core Web Vitals remain external measurements and must not be inferred from source tests or a successful Pages deployment.

## Verified repository facts

- `js/tools-data.json` is the active 55-tool catalogue.
- `tools/index.html` is a static directory page with a 55-item CollectionPage / ItemList.
- Each tool has a dedicated static guide at `tools/<slug>/index.html`.
- The sitemap contains 61 URLs: homepage + directory + 55 guides + four information/policy pages.
- The homepage and directory link to `sitemap.xml`.
- Homepage, directory, guide and information pages publish canonical URLs; the guides use index/follow directives.
- `llms.txt` provides best-effort machine-readable site context. It is not a Google indexing directive or a ranking guarantee.
- Hash fragments such as `/#/tools/json-formatter` are not independent static documents and are excluded from the sitemap.
- The project is hosted at `https://apex-global-labs.github.io/online-tools-hub/`, a GitHub Pages project path.

## Sitemap and canonical policy

The sitemap should contain exactly the following groups:

1. Homepage: `/`
2. Tool directory: `/tools/`
3. All 55 active guide paths: `/tools/<slug>/`
4. Information pages: `/about/`, `/contact/`, `/privacy/`, `/terms/`

Every URL must use HTTPS, the exact production host and `/online-tools-hub/` project prefix. URLs must be unique, canonical, trailing-slash consistent, and contain no query string or fragment. The `lastmod` element must use a valid W3C date. Update a date only when the corresponding page receives a meaningful change; do not refresh every date merely to make the sitemap appear new. `changefreq` and `priority` are not ranking controls.

## robots.txt hosting constraint

A repository file would be published at:

`https://apex-global-labs.github.io/online-tools-hub/robots.txt`

The shared host's origin-root robots endpoint is:

`https://apex-global-labs.github.io/robots.txt`

The project repository cannot make the second URL available through a normal root-level file committed to this project site. Do not add a misleading project-path `robots.txt` and claim that it controls origin-wide crawling. Reassess this only if the site moves to a custom domain or a hosting arrangement that allows control of the host root.

## Internal discovery

- Homepage links to the tool directory and the information/policy pages.
- Directory links to each of the 55 individual guide pages.
- Each guide links to its interactive workspace and relevant related guides.
- Links intended for crawling should remain ordinary HTML anchors with real `href` values, not JavaScript-only click handlers.
- Keep the sitemap, catalogue, directory, guides, keyword map and `llms.txt` synchronized when a tool is added, renamed or retired.

## Automated verification

G4 adds `tests/sitemap-crawling.test.mjs` to verify:

- Exactly 55 unique active catalogue slugs.
- Exactly 61 sitemap URLs and exact set equality with the active page inventory.
- URL uniqueness, HTTPS project-path scope, trailing slash consistency and exclusion of query/hash URLs.
- Valid W3C `lastmod` calendar dates.
- Matching canonical URLs and index/follow directives for the homepage, directory and four information pages.
- Sitemap discovery links on homepage and directory.
- Crawlable directory links to all 55 guide URLs.

Existing guide-specific regression tests separately check guide metadata, canonicals, structured data, visible content and internal links.

## Google Search Console handoff

These steps require the site owner's authenticated Google Search Console session:

1. Open the verified URL-prefix property for `https://apex-global-labs.github.io/online-tools-hub/`.
2. Open **Sitemaps** and submit `sitemap.xml` (or inspect the existing sitemap entry before resubmitting).
3. Record the sitemap's fetch status, discovered URL count, and any parsing errors.
4. Use **URL Inspection** on the homepage, directory, QR Code Generator guide, JSON Formatter guide and two other high-priority guides.
5. Record Google's selected canonical, last crawl, indexing eligibility and any page-specific issue.
6. After data accrues, review Search results performance by query and page: impressions, clicks, CTR and average position. Use those actual queries to decide content updates and check cannibalization.

Do not claim that sitemap submission guarantees indexing, that a URL is indexed because it appears in the sitemap, or that a public `site:` query is a definitive indexing test. No search-volume or keyword-difficulty figures are inferred in this audit.

## Verification boundaries and next priorities

- CI validates repository source consistency; it does not execute Googlebot.
- GitHub Pages deployment success does not prove a visitor-facing page renders correctly in every browser/device.
- Search Console indexing and performance reports must be checked in the owner's account.
- Lighthouse mobile/desktop reports and field Core Web Vitals should be captured separately before making performance claims.
- Do not create thin duplicate pages for keyword variants. Keep one primary search intent and canonical guide URL per tool, then improve that page with useful examples and FAQs grounded in actual tool behavior.
- Do not promise first-place rankings, guaranteed traffic, AI citations or AdSense approval.
