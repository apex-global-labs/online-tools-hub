(() => {
  "use strict";

  const MAX_FILES = 20;
  const MAX_FILE_BYTES = 50 * 1024 * 1024;
  const MAX_TOTAL_BYTES = 200 * 1024 * 1024;
  const MAX_PAGES_PER_FILE = 500;
  const MAX_TOTAL_PAGES = 2000;
  const state = { items: [], busy: false, nextId: 1, resultUrl: null, resultName: "toolnest-merged.pdf" };
  const $ = (selector) => document.querySelector(selector);
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  let libraryPromise = null;

  function status(text, kind) {
    const el = $("#pdfMergeStatus");
    if (!el) return;
    el.textContent = text;
    el.className = "pdf-merge-status" + (kind ? " is-" + kind : "");
  }

  function loadPdfLib() {
    if (window.PDFLib?.PDFDocument) return Promise.resolve(window.PDFLib);
    if (libraryPromise) return libraryPromise;
    libraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js";
      script.async = true;
      script.onload = () => window.PDFLib?.PDFDocument
        ? resolve(window.PDFLib)
        : reject(new Error("The PDF library did not initialize. Reload the page and try again."));
      script.onerror = () => {
        libraryPromise = null;
        reject(new Error("Could not load the PDF engine. Check your internet connection and retry."));
      };
      document.head.appendChild(script);
    });
    return libraryPromise;
  }

  function invalidateResult() {
    if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);
    state.resultUrl = null;
  }

  function selectedCount() {
    return state.items.reduce((sum, item) => sum + item.pages.filter((page) => page.selected).length, 0);
  }

  function totalBytes() {
    return state.items.reduce((sum, item) => sum + item.file.size, 0);
  }

  function render() {
    const list = $("#pdfMergeList");
    const summary = $("#pdfMergeSummary");
    const mergeButton = $("#pdfMergeRun");
    const downloadButton = $("#pdfMergeDownload");
    const fileInput = $("#pdfMergeFiles");
    if (!list || !summary || !mergeButton || !downloadButton) return;

    if (!state.items.length) {
      list.innerHTML = '<div class="pdf-merge-empty">Your PDF files and page controls will appear here.</div>';
    } else {
      list.innerHTML = state.items.map((item, itemIndex) => {
        const selected = item.pages.filter((page) => page.selected).length;
        const pages = item.pages.map((page, position) => {
          const label = page.index + 1;
          return '<div class="pdf-page-row">' +
            '<label class="pdf-page-select"><input type="checkbox" data-action="toggle-page" data-file-id="' + item.id + '" data-page-index="' + page.index + '"' + (page.selected ? " checked" : "") + '><span>Page ' + label + '</span></label>' +
            '<span class="pdf-page-rotation">' + (page.rotation ? "Rotated " + page.rotation + "°" : "Original") + '</span>' +
            '<div class="pdf-page-actions">' +
            '<button type="button" class="btn-secondary" data-action="page-up" data-file-id="' + item.id + '" data-page-index="' + page.index + '" aria-label="Move page ' + label + ' up"' + (position === 0 ? " disabled" : "") + '>↑</button>' +
            '<button type="button" class="btn-secondary" data-action="page-down" data-file-id="' + item.id + '" data-page-index="' + page.index + '" aria-label="Move page ' + label + ' down"' + (position === item.pages.length - 1 ? " disabled" : "") + '>↓</button>' +
            '<button type="button" class="btn-secondary" data-action="rotate-page" data-file-id="' + item.id + '" data-page-index="' + page.index + '" aria-label="Rotate page ' + label + '">↻ 90°</button>' +
            '</div></div>';
        }).join("");
        return '<section class="pdf-file-card" data-file-id="' + item.id + '">' +
          '<div class="pdf-file-heading"><div class="pdf-file-name"><strong>' + escapeHtml(item.file.name) + '</strong><span>' + item.pages.length + ' pages · ' + (item.file.size / 1024 / 1024).toFixed(2) + ' MB · ' + selected + ' selected</span></div>' +
          '<div class="pdf-file-actions">' +
          '<button type="button" class="btn-secondary" data-action="file-up" data-file-id="' + item.id + '" aria-label="Move file up"' + (itemIndex === 0 ? " disabled" : "") + '>↑</button>' +
          '<button type="button" class="btn-secondary" data-action="file-down" data-file-id="' + item.id + '" aria-label="Move file down"' + (itemIndex === state.items.length - 1 ? " disabled" : "") + '>↓</button>' +
          '<button type="button" class="btn-secondary" data-action="remove-file" data-file-id="' + item.id + '">Remove</button></div></div>' +
          '<div class="pdf-range-control"><label for="pdf-range-' + item.id + '">Select page range</label><input id="pdf-range-' + item.id + '" class="field" type="text" inputmode="numeric" placeholder="Example: 1-3,5" value="' + escapeHtml(item.range || "") + '"><button type="button" class="btn-secondary" data-action="apply-range" data-file-id="' + item.id + '">Apply range</button><button type="button" class="btn-secondary" data-action="select-all" data-file-id="' + item.id + '">Select all</button></div>' +
          '<div class="pdf-pages-list">' + pages + '</div></section>';
      }).join("");
    }

    const files = state.items.length;
    const pages = state.items.reduce((sum, item) => sum + item.pages.length, 0);
    summary.textContent = files + " PDF file(s) · " + pages + " total page(s) · " + selectedCount() + " selected · " + (totalBytes() / 1024 / 1024).toFixed(2) + " MB";
    if (fileInput) fileInput.disabled = state.busy;
    list.querySelectorAll("button,input").forEach((control) => { control.disabled = state.busy; });
    mergeButton.disabled = state.busy || selectedCount() === 0;
    downloadButton.disabled = state.busy || !state.resultUrl;
    if (state.busy) mergeButton.textContent = "Processing…";
    else mergeButton.textContent = "Merge Selected Pages";
  }

  function findItem(id) {
    return state.items.find((item) => item.id === Number(id));
  }

  function parsePageRange(value, pageCount) {
    const raw = value.trim();
    if (!raw) throw new Error("Enter a page range, for example 1-3,5.");
    const selected = new Set();
    for (const part of raw.split(",")) {
      const token = part.trim();
      if (!token) throw new Error("The page range contains an empty item.");
      const match = token.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
      if (!match) throw new Error("Use page numbers and ranges such as 1-3,5.");
      const start = Number(match[1]);
      const end = Number(match[2] || match[1]);
      if (start < 1 || end < start || end > pageCount) {
        throw new Error("Page ranges must be between 1 and " + pageCount + ".");
      }
      for (let page = start; page <= end; page++) selected.add(page - 1);
    }
    return selected;
  }

  async function addFiles(fileList) {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;
    if (state.items.length + incoming.length > MAX_FILES) {
      status("You can add up to " + MAX_FILES + " PDF files at a time.", "error");
      return;
    }
    if (totalBytes() + incoming.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_BYTES) {
      status("The combined file size must not exceed 200 MB.", "error");
      return;
    }
    state.busy = true;
    render();
    try {
      const PDF = await loadPdfLib();
      for (const file of incoming) {
        if (file.size > MAX_FILE_BYTES) {
          status(file.name + " is larger than the 50 MB per-file limit and was skipped.", "error");
          continue;
        }
        if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
          status(file.name + " is not a PDF file and was skipped.", "error");
          continue;
        }
        const bytes = new Uint8Array(await file.arrayBuffer());
        const signature = new TextDecoder().decode(bytes.slice(0, 5));
        if (signature !== "%PDF-") {
          status(file.name + " does not have a valid PDF file signature and was skipped.", "error");
          continue;
        }
        try {
          const document = await PDF.PDFDocument.load(bytes, { ignoreEncryption: false, updateMetadata: false });
          const count = document.getPageCount();
          if (!count) throw new Error("This PDF contains no pages.");
          if (count > MAX_PAGES_PER_FILE) throw new Error("This PDF has more than 500 pages. Split it into smaller files before adding it.");
          const existingPages = state.items.reduce((sum, item) => sum + item.pageCount, 0);
          if (existingPages + count > MAX_TOTAL_PAGES) throw new Error("The total page limit is 2,000 pages per merge job.");
          invalidateResult();
          state.items.push({
            id: state.nextId++,
            file,
            bytes,
            pageCount: count,
            range: "1-" + count,
            pages: Array.from({ length: count }, (_, index) => ({ index, selected: true, rotation: 0 }))
          });
          status("Added " + file.name + " (" + count + " pages).", "success");
        } catch (error) {
          status(file.name + " could not be opened. It may be damaged or password-protected. " + (error.message || ""), "error");
        }
      }
    } catch (error) {
      status(error.message || "The PDF engine could not be loaded.", "error");
    } finally {
      state.busy = false;
      render();
    }
  }

  function moveItem(id, direction) {
    const index = state.items.findIndex((item) => item.id === Number(id));
    const next = index + direction;
    if (index < 0 || next < 0 || next >= state.items.length) return;
    invalidateResult();
    const [item] = state.items.splice(index, 1);
    state.items.splice(next, 0, item);
    render();
  }

  function movePage(item, pageIndex, direction) {
    const index = item.pages.findIndex((page) => page.index === Number(pageIndex));
    const next = index + direction;
    if (index < 0 || next < 0 || next >= item.pages.length) return;
    invalidateResult();
    const [page] = item.pages.splice(index, 1);
    item.pages.splice(next, 0, page);
    render();
  }

  function applyRange(item) {
    const input = $("#pdf-range-" + item.id);
    try {
      const chosen = parsePageRange(input?.value || "", item.pageCount);
      invalidateResult();
      item.pages.forEach((page) => { page.selected = chosen.has(page.index); });
      item.range = input.value.trim();
      status("Selected " + chosen.size + " page(s) from " + item.file.name + ".", "success");
      render();
    } catch (error) {
      status(error.message, "error");
      input?.focus();
    }
  }

  async function merge() {
    if (state.busy || selectedCount() === 0) {
      status("Add a PDF and select at least one page before merging.", "error");
      return;
    }
    state.busy = true;
    render();
    status("Preparing your merged PDF. Keep this tab open…");
    try {
      const PDF = await loadPdfLib();
      const merged = await PDF.PDFDocument.create();
      let added = 0;
      for (const item of state.items) {
        const selected = item.pages.filter((page) => page.selected);
        if (!selected.length) continue;
        const source = await PDF.PDFDocument.load(item.bytes, { ignoreEncryption: false, updateMetadata: false });
        const copiedPages = await merged.copyPages(source, selected.map((page) => page.index));
        copiedPages.forEach((page, index) => {
          const rotation = selected[index].rotation;
          if (rotation) {
            const current = page.getRotation().angle || 0;
            page.setRotation(PDF.degrees((current + rotation) % 360));
          }
          merged.addPage(page);
          added++;
        });
      }
      if (!added) throw new Error("No pages were selected for the new PDF.");
      merged.setTitle("ToolNest merged PDF");
      merged.setCreator("ToolNest Advanced PDF Merger");
      merged.setProducer("ToolNest · pdf-lib");
      const bytes = await merged.save({ useObjectStreams: true });
      const blob = new Blob([bytes], { type: "application/pdf" });
      if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);
      state.resultUrl = URL.createObjectURL(blob);
      state.resultName = "toolnest-merged.pdf";
      status("Success! " + added + " page(s) merged into one PDF (" + (blob.size / 1024).toFixed(1) + " KB). Select Download Merged PDF.", "success");
    } catch (error) {
      status(error.message || "The PDFs could not be merged. Check the files and try again.", "error");
    } finally {
      state.busy = false;
      render();
    }
  }

  function download() {
    if (!state.resultUrl) {
      status("Merge the selected pages before downloading.", "error");
      return;
    }
    const link = document.createElement("a");
    link.href = state.resultUrl;
    link.download = state.resultName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    status("Your merged PDF download has started.", "success");
  }

  function clear() {
    if (state.busy) { status("Wait for the current PDF task to finish before clearing.", "error"); return; }
    if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);
    state.items = [];
    state.resultUrl = null;
    state.resultName = "toolnest-merged.pdf";
    const input = $("#pdfMergeFiles");
    if (input) input.value = "";
    status("All files and selections cleared.");
    render();
  }

  function init() {
    const input = $("#pdfMergeFiles");
    const list = $("#pdfMergeList");
    const mergeButton = $("#pdfMergeRun");
    const downloadButton = $("#pdfMergeDownload");
    const clearButton = $("#pdfMergeClear");
    if (!input || !list || !mergeButton || !downloadButton || !clearButton) return;
    input.addEventListener("change", () => {
      addFiles(input.files);
      input.value = "";
    });
    list.addEventListener("change", (event) => {
      const checkbox = event.target.closest('[data-action="toggle-page"]');
      if (!checkbox) return;
      const item = findItem(checkbox.dataset.fileId);
      const page = item?.pages.find((entry) => entry.index === Number(checkbox.dataset.pageIndex));
      if (!page) return;
      invalidateResult();
      page.selected = checkbox.checked;
      render();
    });
    list.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const item = findItem(button.dataset.fileId);
      const action = button.dataset.action;
      if (action === "file-up") moveItem(button.dataset.fileId, -1);
      else if (action === "file-down") moveItem(button.dataset.fileId, 1);
      else if (action === "remove-file") {
        state.items = state.items.filter((entry) => entry.id !== Number(button.dataset.fileId));
        render();
        status("PDF file removed.");
      } else if (item && action === "page-up") movePage(item, button.dataset.pageIndex, -1);
      else if (item && action === "page-down") movePage(item, button.dataset.pageIndex, 1);
      else if (item && action === "rotate-page") {
        const page = item.pages.find((entry) => entry.index === Number(button.dataset.pageIndex));
        if (page) { invalidateResult(); page.rotation = (page.rotation + 90) % 360; }
        render();
      } else if (item && action === "apply-range") applyRange(item);
      else if (item && action === "select-all") {
        item.pages.forEach((page) => { page.selected = true; });
        item.range = "1-" + item.pageCount;
        render();
        status("All pages selected for " + item.file.name + ".");
      }
    });
    mergeButton.addEventListener("click", merge);
    downloadButton.addEventListener("click", download);
    clearButton.addEventListener("click", clear);
    render();
  }

  window.ToolNestPdfMerge = { init, clear, merge, download };
})();