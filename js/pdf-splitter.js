(() => {
  "use strict";
  const MAX_FILE_BYTES = 30 * 1024 * 1024;
  const MAX_PAGES = 300;
  const state = { file: null, bytes: null, pages: [], outputs: [], busy: false };
  const $ = (selector) => document.querySelector(selector);
  let pdfPromise = null;
  let zipPromise = null;

  function setStatus(message, kind = "") {
    const el = $("#pdfSplitStatus");
    if (!el) return;
    el.textContent = message;
    el.className = "pdf-split-status" + (kind ? " is-" + kind : "");
  }
  function loadPdfLib() {
    if (window.PDFLib?.PDFDocument) return Promise.resolve(window.PDFLib);
    if (pdfPromise) return pdfPromise;
    pdfPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js";
      script.async = true;
      script.onload = () => window.PDFLib?.PDFDocument ? resolve(window.PDFLib) : reject(new Error("PDF engine did not initialize."));
      script.onerror = () => { pdfPromise = null; reject(new Error("Could not load the PDF engine. Check your connection and retry.")); };
      document.head.appendChild(script);
    });
    return pdfPromise;
  }
  function loadZip() {
    if (window.JSZip) return Promise.resolve(window.JSZip);
    if (zipPromise) return zipPromise;
    zipPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      script.async = true;
      script.onload = () => window.JSZip ? resolve(window.JSZip) : reject(new Error("ZIP library did not initialize."));
      script.onerror = () => { zipPromise = null; reject(new Error("Could not load ZIP support. Try downloading one page at a time.")); };
      document.head.appendChild(script);
    });
    return zipPromise;
  }
  function parseRange(value, count) {
    const raw = value.trim();
    if (!raw) throw new Error("Enter a page range, for example 1-3,5.");
    const selected = new Set();
    for (const part of raw.split(",")) {
      const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
      if (!match) throw new Error("Use page numbers and ranges such as 1-3,5.");
      const start = Number(match[1]), end = Number(match[2] || match[1]);
      if (start < 1 || end < start || end > count) throw new Error("Page numbers must be between 1 and " + count + ".");
      for (let page = start; page <= end; page++) selected.add(page - 1);
    }
    return selected;
  }
  function selectedPages() { return state.pages.filter(page => page.selected); }
  function safeBaseName(name) {
    return name.replace(/\.pdf$/i, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "document";
  }
  function render() {
    const list = $("#pdfSplitPages"), summary = $("#pdfSplitSummary");
    const run = $("#pdfSplitRun"), download = $("#pdfSplitDownload");
    if (!list || !summary || !run || !download) return;
    if (!state.file) list.innerHTML = '<div class="pdf-split-empty">Upload a PDF to view its pages.</div>';
    else list.innerHTML = state.pages.map(page =>
      '<label class="pdf-split-page"><input type="checkbox" data-page="' + page.index + '"' + (page.selected ? " checked" : "") + (state.busy ? " disabled" : "") + '><span>Page ' + (page.index + 1) + '</span></label>'
    ).join("");
    summary.textContent = state.file
      ? state.file.name + " · " + state.pages.length + " page(s) · " + selectedPages().length + " selected"
      : "No PDF selected.";
    run.disabled = state.busy || selectedPages().length === 0;
    download.disabled = state.busy || state.outputs.length === 0;
    $("#pdfSplitFiles").disabled = state.busy;
    $("#pdfSplitRange").disabled = state.busy || !state.file;
    $("#pdfSplitApplyRange").disabled = state.busy || !state.file;
    $("#pdfSplitSelectAll").disabled = state.busy || !state.file;
    $("#pdfSplitSelectNone").disabled = state.busy || !state.file;
    run.textContent = state.busy ? "Splitting…" : "Split Selected Pages";
  }
  async function openFile(file) {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) { setStatus("This file is larger than the 30 MB limit.", "error"); return; }
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") { setStatus("Choose a PDF file.", "error"); return; }
    state.busy = true; render();
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-") throw new Error("This file does not have a valid PDF signature.");
      const PDF = await loadPdfLib();
      const doc = await PDF.PDFDocument.load(bytes, { ignoreEncryption: false, updateMetadata: false });
      const count = doc.getPageCount();
      if (!count) throw new Error("This PDF contains no pages.");
      if (count > MAX_PAGES) throw new Error("This PDF has more than 300 pages. Use a smaller document.");
      state.file = file;
      state.bytes = bytes;
      state.pages = Array.from({ length: count }, (_, index) => ({ index, selected: true }));
      state.outputs = [];
      $("#pdfSplitRange").value = "1-" + count;
      setStatus("PDF loaded. Select pages or enter a page range.", "success");
    } catch (error) {
      state.file = null; state.bytes = null; state.pages = []; state.outputs = [];
      setStatus(error.message || "Could not open this PDF. It may be damaged or password-protected.", "error");
    } finally { state.busy = false; render(); }
  }
  function applyRange() {
    if (!state.file) return;
    try {
      const chosen = parseRange($("#pdfSplitRange").value, state.pages.length);
      state.pages.forEach(page => { page.selected = chosen.has(page.index); });
      state.outputs = [];
      setStatus(chosen.size + " page(s) selected.", "success");
      render();
    } catch (error) { setStatus(error.message, "error"); }
  }
  async function split() {
    if (state.busy || !state.file || !selectedPages().length) {
      setStatus("Upload a PDF and select at least one page.", "error"); return;
    }
    state.busy = true; state.outputs = []; render();
    setStatus("Creating separate PDF files in your browser…");
    try {
      const PDF = await loadPdfLib();
      const source = await PDF.PDFDocument.load(state.bytes, { ignoreEncryption: false, updateMetadata: false });
      const base = safeBaseName(state.file.name);
      for (const page of selectedPages()) {
        const output = await PDF.PDFDocument.create();
        const [copied] = await output.copyPages(source, [page.index]);
        output.addPage(copied);
        output.setTitle(base + " - Page " + (page.index + 1));
        output.setCreator("ToolNest PDF Splitter");
        const bytes = await output.save({ useObjectStreams: true });
        state.outputs.push({
          name: base + "-page-" + String(page.index + 1).padStart(3, "0") + ".pdf",
          blob: new Blob([bytes], { type: "application/pdf" })
        });
      }
      setStatus("Created " + state.outputs.length + " separate PDF file(s). " + (state.outputs.length > 1 ? "Download them together as a ZIP." : "Download your PDF."), "success");
    } catch (error) {
      state.outputs = [];
      setStatus(error.message || "The selected pages could not be split.", "error");
    } finally { state.busy = false; render(); }
  }
  async function download() {
    if (!state.outputs.length) { setStatus("Split the selected pages before downloading.", "error"); return; }
    try {
      if (state.outputs.length === 1) {
        const item = state.outputs[0], url = URL.createObjectURL(item.blob);
        const link = document.createElement("a"); link.href = url; link.download = item.name;
        document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
      } else {
        setStatus("Preparing ZIP download…");
        const JSZip = await loadZip(), zip = new JSZip();
        state.outputs.forEach(item => zip.file(item.name, item.blob));
        const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 3 } });
        const url = URL.createObjectURL(blob), link = document.createElement("a");
        link.href = url; link.download = safeBaseName(state.file.name) + "-split-pages.zip";
        document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
      }
      setStatus("Your download has started.", "success");
    } catch (error) { setStatus(error.message || "Could not prepare the download.", "error"); }
  }
  function clear() {
    if (state.busy) return;
    state.file = null; state.bytes = null; state.pages = []; state.outputs = [];
    const input = $("#pdfSplitFiles"); if (input) input.value = "";
    const range = $("#pdfSplitRange"); if (range) range.value = "";
    setStatus("All files and selections cleared."); render();
  }
  function init() {
    const input = $("#pdfSplitFiles"), pages = $("#pdfSplitPages");
    if (!input || !pages) return;
    input.addEventListener("change", () => openFile(input.files?.[0]));
    pages.addEventListener("change", event => {
      const checkbox = event.target.closest("[data-page]");
      if (!checkbox || state.busy) return;
      const page = state.pages.find(item => item.index === Number(checkbox.dataset.page));
      if (page) { page.selected = checkbox.checked; state.outputs = []; render(); }
    });
    $("#pdfSplitApplyRange").addEventListener("click", applyRange);
    $("#pdfSplitSelectAll").addEventListener("click", () => { state.pages.forEach(page => page.selected = true); state.outputs = []; render(); });
    $("#pdfSplitSelectNone").addEventListener("click", () => { state.pages.forEach(page => page.selected = false); state.outputs = []; render(); });
    $("#pdfSplitRun").addEventListener("click", split);
    $("#pdfSplitDownload").addEventListener("click", download);
    $("#pdfSplitClear").addEventListener("click", clear);
    render();
  }
  window.ToolNestPdfSplitter = { init, clear, split, download, parseRange };
})();