# Phase 11 — Text & Writing Tools

Date: 2026-10-30  
Work branch: `phase11-text-writing`  
Target catalogue size: 26 tools  
Architecture: static HTML/CSS/Vanilla JavaScript; no backend and no new third-party dependency.

## Scope reconciliation

The repository audit found that Text Diff Checker, Word & Character Counter, Text Case Converter and Extra Spaces Remover already existed. They were retained rather than duplicated. Phase 11 therefore adds one new tool and improves the existing text utilities. Unicode-to-Bijoy and Bijoy-to-Unicode conversion are excluded.

## Added tool

| Tool | Main behavior | Validation / privacy |
|---|---|---|
| Lorem Ipsum Generator | Creates 1–10 paragraphs with 1–8 sentences each; optional classic Lorem ipsum opening | Validates integer ranges; generates text locally in the browser; uses shared Copy/Download/Clear actions |

## Existing text-tool improvements

- Text Case Converter and Word & Character Counter count Unicode code points for character totals, avoiding the common UTF-16 issue where many emoji and supplementary characters count as two.
- Text Case Converter refreshes its statistics immediately when opened and whenever the input changes.
- Extra Spaces Remover can process whitespace-only input, allowing it to clean pasted spaces or tabs into an empty result.
- Existing Text Diff Checker, Word & Character Counter, Duplicate Lines Remover and Markdown Previewer remain in the catalogue.

## Catalogue and SEO

- `app.js` and `js/tools-data.json` contain 26 matching unique tools and slugs.
- Lorem Ipsum Generator includes a dedicated description, usage steps, features and three FAQs.
- Search placeholder and README catalogue count are updated.
- No new package, paid service, backend or external dependency is introduced.

## Verification boundary

The regression suite checks catalogue/metadata parity, Lorem Ipsum markup and event wiring, range guards, SEO completeness, Unicode-aware counters, and the whitespace-only cleanup path. CI results, Pages deployment, and real-browser behavior must be confirmed separately. Source-level tests do not replace browser checks for generation, clipboard, download, Clear, mobile layout or Day/Night theme.
