# Phase 6 — Sitemap & Crawling Audit

Date: 2026-10-30  
Project: ToolNest / Online Tools Hub  
Production URL: https://apex-global-labs.github.io/online-tools-hub/

## Scope

This phase validates the static crawlable surface and documents hosting constraints. It does not rewrite tool implementations, hash routing, canonical URLs, or the existing 40 guide URLs.

## Current crawlable page inventory

The intended indexable HTML inventory is 42 URLs:

1. Homepage: `https://apex-global-labs.github.io/online-tools-hub/`
2. Guide directory: `https://apex-global-labs.github.io/online-tools-hub/tools/`
3. Forty individual guides under `/tools/<slug>/`

The interactive tool workspaces remain hash routes on the homepage (for example, `/#/tools/qr-generator`). Hash fragments are not separate static pages and must not be added to the XML sitemap.

## Sitemap findings

- `sitemap.xml` uses the Sitemap Protocol XML namespace and absolute HTTPS URLs.
- It lists exactly the homepage, guide directory, and all 40 guide URLs.
- URLs use the production host and GitHub Pages project path; duplicate URLs, query strings, and hash fragments are not intended.
- Every guide URL is paired with its matching canonical link.
- The current `lastmod` entries use W3C date format. Keep these dates truthful: update a page's value only when that page receives a significant content, structured-data, or link change. Do not blindly refresh every date on each release.
- Google documents that `changefreq` and `priority` are ignored. Their presence is harmless but they should not be treated as ranking or crawl-frequency controls.

## Robots.txt hosting limitation

This project is hosted at `https://apex-global-labs.github.io/online-tools-hub/`, which is a GitHub Pages **project site**. Search crawlers look for a host-wide robots file at:

`https://apex-global-labs.github.io/robots.txt`

A file committed to this repository would instead be published below the project path:

`https://apex-global-labs.github.io/online-tools-hub/robots.txt`

That is not the host-root robots file. Do not add a repository-level `robots.txt` and claim that it controls crawling for this host. A root-level robots file requires control of the GitHub Pages host root or a suitable custom domain / hosting configuration. The existing public pages have no `noindex` directive; the guide pages explicitly use `index,follow`.

## Internal discovery

- Homepage links to the guide directory.
- The guide directory links directly to all 40 static guide pages.
- Each guide links to the homepage, guide directory, and its corresponding interactive workspace.
- Related-guide links provide additional paths between relevant pages.
- Keep these as ordinary HTML anchor links; do not rely only on JavaScript click handlers for discovery.

## Automated verification added in Phase 6

`tests/sitemap-crawling.test.mjs` checks:

- XML sitemap root/namespace and expected URL inventory (42 URLs).
- Uniqueness, production origin, project-path scope, no query/hash URLs, and trailing slash consistency.
- W3C date formatting for current `lastmod` values.
- Homepage, directory, and guide canonical URL consistency.
- Explicit index/follow directives on static guides.
- Crawlable internal links from the homepage/directory/guides.
- README explanation of the project-site robots.txt limitation.

## Search Console handoff (manual account action)

After the changes are merged and the published file is reachable, the site owner can:

1. Open Google Search Console for the exact property that owns `https://apex-global-labs.github.io/online-tools-hub/`.
2. Open **Sitemaps** and submit `sitemap.xml`.
3. Review the reported fetch status, discovered URL count, and any sitemap parsing errors.
4. Use URL Inspection on representative guide URLs and review indexing/canonical status.

These actions require the owner's Search Console access. Repository CI cannot confirm Google has fetched, crawled, or indexed the pages. Sitemap submission is a discovery hint, not an indexing guarantee.

## Verification boundaries

- Automated source/CI checks do not prove the public deployment has updated.
- A successful GitHub Pages deployment does not prove Google indexed the pages.
- Real-browser checks and Search Console reports must be recorded separately from repository tests.
