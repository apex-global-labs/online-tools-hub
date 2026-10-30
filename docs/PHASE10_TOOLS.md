# Phase 10 — Five new ToolNest tools

Date: 2026-10-30  
Target catalogue size: 25 tools (previously 20)  
Architecture: static HTML/CSS/Vanilla JavaScript; no backend and no new third-party dependency.

## Added tools

| Tool | Main behavior | Safety / validation |
|---|---|---|
| Unix Timestamp Converter | Seconds/milliseconds to UTC/local date; local datetime back to timestamp | Rejects non-numeric values and dates outside JavaScript's supported range |
| Extra Spaces Remover | Collapses repeated spaces/tabs; optional line trimming and blank-line removal | Keeps text local; blank-line removal is opt-in |
| HTML Entity Encoder / Decoder | Encodes and decodes HTML character references | Uses a textarea context and returns plain text; decoded markup is not inserted into the page |
| Image Resizer | Resizes PNG/JPEG/WebP to custom pixel dimensions; optional aspect-ratio preservation | Local-only processing; 10 MB input cap; dimensions limited to 4096 px |
| Image Compressor | Exports local images as JPEG/WebP with adjustable quality | Local-only processing; 10 MB input cap; dimensions limited to 4096 px; preview and size comparison |

## Shared behavior

- All five tools are in the main catalogue and router metadata with unique IDs/slugs.
- Each has dedicated workspace markup and event wiring.
- Universal Copy/Download/Clear remain available. Image tools use a generated Blob URL for the Download action; Clear revokes the generated URL and resets the image tool's state.
- SEO metadata includes usage steps, feature descriptions and three FAQs per tool.
- No new paid service, backend, package or third-party library was added.

## Verification boundary

The Node regression suite is intended to verify catalogue/metadata parity, tool markup/wiring, key validation guards and image download hooks. Automated source tests do not prove canvas rendering or browser download behavior on every device. After merge, live browser checks should verify timestamp conversions, whitespace edge cases, HTML entity round-trips, image dimensions/quality, downloads, Clear, mobile layout and Day/Night theme.
