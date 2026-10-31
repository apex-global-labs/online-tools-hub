# ToolNest — Free Online Tools

A static, browser-based multi-tool website. No backend or build step is required. The public site is hosted on GitHub Pages.

## Main files
- `index.html` — page structure, header, hero search, tool grid, workspace and footer
- `style.css` — base responsive styling and light/dark theme variables
- `css/phase2.css` — search/navigation styling, dark-mode contrast and animated sun/moon scene
- `app.js` — tool catalogue, filters, workspace rendering, theme toggle and tool implementations
- `js/live-search.js` — search autocomplete, keyboard navigation, category menu behavior and slash shortcut
- `js/tools-data.json` — metadata for all 46 tools used by the modular hash router
- `js/router.js` — route parsing/resolution
- `js/router-bridge.js` — bridge from modular routes to the existing tool workspace
- `css/phase10-image-tools.css` — responsive previews for the image utilities
- `css/phase14-image-tools.css` — cropper, format-converter and Base64 image preview refinements
- `css/phase15-developer-seo.css` — CSS gradient preview styling
- `css/phase12-calculators.css` — responsive finance calculator refinements
- `js/finance-calculators.js` — bounded, reusable percentage, compound-interest and EMI formula helpers
- `js/advanced-converters.js` — local area, Bangladesh land-unit, time-zone and number-to-words helpers
- `js/phase15-developer-seo.js` — local robots.txt, XML sitemap and CSS gradient generators
- `js/ip-tools.js` — IPv4/IPv6 validation and special-use range classification
- `js/pdf-splitter.js` — local PDF page extraction with individual PDF and ZIP downloads
- `js/image-to-pdf.js` — local PNG/JPEG image conversion to a multi-page PDF
- `js/url-shortener.js` — browser-side integration with a free third-party URL-shortening API
- `css/pdf-splitter.css` — responsive PDF Splitter workspace styling
- `css/image-to-pdf.css` — responsive Image to PDF workspace styling
- `css/ip-tools.css` — responsive IP lookup results and status styling
- `css/phase13-converters.css` — responsive styling for advanced converters
- `tools/` — static, individually crawlable tool guide pages and the tool-guide directory
- `sitemap.xml` — homepage, tool directory and 46 canonical tool-page URLs
- `PROJECT_STATE.md` — current status, verification notes and next-step roadmap

## Current UI features
- Search tools by name, category or description
- Autocomplete suggestions; Enter, Escape and arrow-key navigation
- `Ctrl+K` / `Cmd+K` focuses the search field; `/` is an additional shortcut when not typing
- Category filter chips and a Categories dropdown
- Light / Night theme toggle with a rising sun or moon scene and subtle stars at night
- Theme preference is saved when browser storage is available
- Responsive layout and reduced-motion support for the decorative scene

## Tool catalogue (44)

### Text
- Text Case Converter
- Slug Generator
- Text Diff Checker
- Markdown Previewer
- Word & Character Counter
- Duplicate Lines Remover
- Extra Spaces Remover
- Lorem Ipsum Generator

### Developer
- Base64 Encoder / Decoder
- JSON Formatter & Validator
- URL Encode / Decode
- Meta Tag Generator
- CSV ↔ JSON Converter
- UUID Generator
- SHA-256 Hash Generator
- HTML Entity Encoder / Decoder
- Robots.txt Generator
- XML Sitemap Generator
- CSS Gradient Generator

### Images
- Image to Base64
- QR Code Generator
- Color Converter
- Image Resizer
- Image Compressor
- Image Cropper
- Image Format Converter
- Base64 to Image

### Calculators
- Area Converter
- Bangladesh Land Unit Converter
- Forex Currency Converter
- Unit Converter
- Age & Date Difference
- Unix Timestamp Converter
- Percentage Calculator
- Compound Interest Calculator
- EMI / Loan Calculator

### Utilities
- Password Generator
- Time Zone Converter
- Number to Words Converter (English and Bangla)
- Advanced PDF Merger — merge PDF files with page selection, file/page ordering and rotation
- PDF Splitter — export selected PDF pages as separate files or a ZIP archive
- Image to PDF — combine PNG/JPEG images into a paginated PDF with paper settings
- URL Shortener — create shareable short links with an optional custom alias through Spoo.me's free API v1 (no API key required)
- Universal Doc Formatter & Spacing Fixer — clean pasted text or repair DOCX whitespace locally while retaining Word XML structure
- IP Address Finder & Lookup

### IP Address Finder & Lookup
- Finds the public IP visible to the external lookup provider or looks up a manually entered public IPv4/IPv6 address.
- Uses the IPWHOIS.io free endpoint (up to 1,000 requests per day per website domain); actual availability and limits are controlled by the provider.
- Displays approximate country, region, city, postal area, coordinates, ISP, organization, ASN and time zone when available.
- IP data is sent directly from the visitor's browser to the provider; ToolNest does not proxy or intentionally store the lookup input. The provider may process request data under its own policy.
- The free endpoint does not include VPN/proxy/Tor detection. Location and coordinates are estimates, not a home address or exact GPS location.

## Search engine crawl files

- `sitemap.xml` lists the canonical homepage, the tool-guide directory and 46 individual static tool-guide URLs. Each guide has a unique title, meta description, canonical URL, visible instructions, features, FAQs and structured data. Interactive workspaces still open through the existing hash-based app routes; hash fragments are not listed as separate pages.
- This is a GitHub Pages project site published under `/online-tools-hub/`. A `robots.txt` stored in this repository would be served at the project subpath, not the origin root (`https://apex-global-labs.github.io/robots.txt`) where host-wide crawl rules are expected. No repository-level `robots.txt` is provided; do not describe one as present.
- The homepage has a canonical URL plus Open Graph and Twitter title/description metadata. A social preview image is not yet configured.
- Search engines decide independently whether and how to crawl, index, and display the site. Inclusion in a sitemap does not guarantee indexing or rankings.

## Run locally
Open `index.html` in a modern browser while connected to the internet. Tailwind CSS and `qr-code-styling` are loaded from CDNs. PDF tools load `pdf-lib` on demand; PDF Splitter loads JSZip only when downloading multiple page files as a ZIP. Image to PDF supports up to 20 PNG/JPEG images (15 MB each, 60 MB total) and creates one page per image. URL Shortener sends submitted destination URLs directly to Spoo.me; anonymous API use is currently limited to 20 requests per minute and 1,000 per day.

## Deploy with GitHub Pages
1. Open repository **Settings → Pages**.
2. Under Build and deployment, select **Deploy from a branch**.
3. Select `main` and `/(root)`, then save.
4. Wait for GitHub Pages to publish the latest commit.

## Important notes
- Tool processing is browser-based unless a tool explicitly fetches a public reference service (the currency converter retrieves exchange-rate data, and URL Shortener sends destination URLs to Spoo.me to create redirects). Advanced PDF Merger, PDF Splitter and Image to PDF process files locally; PDF Splitter uses a public CDN for ZIP packaging when multiple page files are downloaded. Image Resizer and Image Compressor process local images in the browser; each input is limited to 10 MB.
- Avoid describing every tool as fully private: the currency converter makes a network request, and external libraries are loaded from CDNs.
- Percentage, compound-interest and EMI calculators use local formulas. The currency selectors only format the displayed amount; they do not fetch exchange rates. These calculators provide estimates, not financial advice or lender offers.
- Tailwind's browser CDN is convenient for a prototype; a production build can later compile and pin assets locally.
- Phase 2 UI interactions have been manually spot-checked by the owner. The newest theme-persistence and keyboard-navigation changes should be re-tested on desktop and mobile after deployment.


### Bengali dictionary attribution

DocFix Pro includes the Bengali word list from https://github.com/Sanjidh090/bangla-wordlist, containing 454,650 entries. The source repository states that the list is released under the Unlicense (public-domain dedication). It is used locally for conservative Bengali word segmentation.
