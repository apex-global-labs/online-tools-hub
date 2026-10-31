(() => {
  "use strict";

  const MAX_FILES = 20;
  const MAX_FILE_BYTES = 15 * 1024 * 1024;
  const MAX_TOTAL_BYTES = 60 * 1024 * 1024;
  const MAX_IMAGE_PIXELS = 40_000_000;
  const MAX_TOTAL_PIXELS = 100_000_000;
  const MAX_DIMENSION = 12000;
  const state = { items: [], busy: false, resultUrl: null };
  let pdfPromise = null;
  const $ = (selector) => document.querySelector(selector);

  function status(message, kind = "") {
    const node = $("#imagePdfStatus");
    if (!node) return;
    node.textContent = message;
    node.className = "image-pdf-status" + (kind ? " is-" + kind : "");
  }

  function loadPdfLib() {
    if (window.PDFLib?.PDFDocument) return Promise.resolve(window.PDFLib);
    if (pdfPromise) return pdfPromise;
    pdfPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js";
      script.async = true;
      script.onload = () => window.PDFLib?.PDFDocument
        ? resolve(window.PDFLib)
        : reject(new Error("The PDF library did not initialize. Reload the page and try again."));
      script.onerror = () => {
        pdfPromise = null;
        reject(new Error("Could not load the PDF engine. Check your internet connection and retry."));
      };
      document.head.appendChild(script);
    });
    return pdfPromise;
  }

  function revokeResult() {
    if (state.resultUrl) URL.revokeObjectURL(state.resultUrl);
    state.resultUrl = null;
    const preview = $("#imagePdfPreview");
    if (preview) { preview.removeAttribute("src"); preview.hidden = true; }
    const download = $("#imagePdfDownload");
    if (download) download.disabled = true;
  }

  function revokeItem(item) {
    if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
  }

  function totalBytes() { return state.items.reduce((sum, item) => sum + item.file.size, 0); }
  function totalPixels() { return state.items.reduce((sum, item) => sum + item.width * item.height, 0); }
  function formatBytes(bytes) { return bytes >= 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(2) + " MB" : (bytes / 1024).toFixed(1) + " KB"; }

  function render() {
    const list = $("#imagePdfList");
    const summary = $("#imagePdfSummary");
    const create = $("#imagePdfCreate");
    const input = $("#imagePdfFiles");
    if (!list || !summary || !create) return;
    if (!state.items.length) {
      list.innerHTML = '<div class="image-pdf-empty">Your selected images and page order will appear here.</div>';
    } else {
      list.innerHTML = state.items.map((item, index) =>
        '<article class="image-pdf-card" data-image-id="' + item.id + '">' +
          '<img src="' + item.previewUrl + '" alt="Preview of ' + escapeHtml(item.file.name) + '">' +
          '<div class="image-pdf-card-info"><strong>' + escapeHtml(item.file.name) + '</strong><span>' +
          item.width + ' × ' + item.height + ' px · ' + formatBytes(item.file.size) + '</span></div>' +
          '<div class="image-pdf-card-actions">' +
          '<button type="button" class="btn-secondary" data-action="up" data-id="' + item.id + '"' + (index === 0 ? ' disabled' : '') + ' aria-label="Move image up">↑</button>' +
          '<button type="button" class="btn-secondary" data-action="down" data-id="' + item.id + '"' + (index === state.items.length - 1 ? ' disabled' : '') + ' aria-label="Move image down">↓</button>' +
          '<button type="button" class="btn-secondary" data-action="remove" data-id="' + item.id + '">Remove</button></div></article>'
      ).join("");
    }
    summary.textContent = state.items.length + " image(s) · " + formatBytes(totalBytes()) + " total · " +
      (totalPixels() / 1_000_000).toFixed(1) + " megapixels";
    if (input) input.disabled = state.busy || state.items.length >= MAX_FILES;
    list.querySelectorAll("button").forEach(button => { button.disabled = state.busy || button.disabled; });
    create.disabled = state.busy || state.items.length === 0;
    create.textContent = state.busy ? "Creating PDF…" : "Create PDF";
    $("#imagePdfClear").disabled = state.busy;
    $("#imagePdfPageSize").disabled = state.busy;
    $("#imagePdfOrientation").disabled = state.busy;
    $("#imagePdfMargin").disabled = state.busy;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function readImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        const width = image.naturalWidth, height = image.naturalHeight;
        if (!width || !height || width > MAX_DIMENSION || height > MAX_DIMENSION || width * height > MAX_IMAGE_PIXELS) {
          reject(new Error(file.name + " exceeds the safe image dimension limit (12,000 px per side / 40 megapixels)."));
          return;
        }
        resolve({ width, height });
      };
      image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read " + file.name + ". The image may be damaged.")); };
      image.src = url;
    });
  }

  function validSignature(bytes, type) {
    if (type === "image/png") return bytes.length >= 8 &&
      [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a].every((v, i) => bytes[i] === v);
    if (type === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    return false;
  }

  async function addFiles(fileList) {
    if (state.busy) return;
    const files = Array.from(fileList || []);
    if (!files.length) return;
    revokeResult();
    try {
      for (const file of files) {
        if (state.items.length >= MAX_FILES) throw new Error("You can add up to 20 images per PDF.");
        if (!["image/png", "image/jpeg"].includes(file.type) || !/\.(png|jpe?g)$/i.test(file.name)) {
          throw new Error(file.name + ": choose a PNG or JPEG image.");
        }
        if (file.size <= 0 || file.size > MAX_FILE_BYTES) throw new Error(file.name + ": each image must be 15 MB or smaller.");
        if (totalBytes() + file.size > MAX_TOTAL_BYTES) throw new Error("The combined image size cannot exceed 60 MB.");
        const bytes = new Uint8Array(await file.arrayBuffer());
        if (!validSignature(bytes, file.type)) throw new Error(file.name + ": the file content does not match a valid PNG or JPEG image.");
        const dimensions = await readImage(file);
        if (totalPixels() + dimensions.width * dimensions.height > MAX_TOTAL_PIXELS) {
          throw new Error("The combined image resolution cannot exceed 100 megapixels.");
        }
        state.items.push({
          id: state.items.length ? Math.max(...state.items.map(item => item.id)) + 1 : 1,
          file, bytes, type: file.type, ...dimensions, previewUrl: URL.createObjectURL(file)
        });
      }
      status(files.length + " image(s) added. Arrange the order, choose page settings, then create your PDF.", "success");
    } catch (error) {
      status(error.message || "Could not add the selected images.", "error");
    } finally {
      $("#imagePdfFiles").value = "";
      render();
    }
  }

  function moveItem(id, direction) {
    const index = state.items.findIndex(item => item.id === Number(id));
    const target = index + direction;
    if (index < 0 || target < 0 || target >= state.items.length) return;
    [state.items[index], state.items[target]] = [state.items[target], state.items[index]];
    revokeResult();
    render();
  }

  function removeItem(id) {
    const index = state.items.findIndex(item => item.id === Number(id));
    if (index < 0) return;
    revokeItem(state.items[index]);
    state.items.splice(index, 1);
    revokeResult();
    status("Image removed.", "success");
    render();
  }

  function pageDimensions(pageSize, orientation, imageWidth, imageHeight) {
    const sizes = {
      a4: [595.28, 841.89],
      letter: [612, 792],
      legal: [612, 1008]
    };
    let [width, height] = sizes[pageSize] || sizes.a4;
    const landscape = orientation === "landscape" || (orientation === "auto" && imageWidth > imageHeight);
    if (landscape) [width, height] = [height, width];
    return [width, height];
  }

  async function createPdf() {
    if (state.busy || !state.items.length) return;
    state.busy = true;
    revokeResult();
    render();
    status("Preparing your images and creating the PDF in this browser…");
    try {
      const PDF = await loadPdfLib();
      const output = await PDF.PDFDocument.create();
      const pageSize = $("#imagePdfPageSize").value;
      const orientation = $("#imagePdfOrientation").value;
      const marginMm = Number($("#imagePdfMargin").value);
      const margin = marginMm * 72 / 25.4;
      for (const item of state.items) {
        const embedded = item.type === "image/png"
          ? await output.embedPng(item.bytes)
          : await output.embedJpg(item.bytes);
        const [pageWidth, pageHeight] = pageDimensions(pageSize, orientation, item.width, item.height);
        const availableWidth = Math.max(1, pageWidth - margin * 2);
        const availableHeight = Math.max(1, pageHeight - margin * 2);
        const scale = Math.min(availableWidth / embedded.width, availableHeight / embedded.height);
        const drawWidth = embedded.width * scale, drawHeight = embedded.height * scale;
        const page = output.addPage([pageWidth, pageHeight]);
        page.drawImage(embedded, {
          x: (pageWidth - drawWidth) / 2,
          y: (pageHeight - drawHeight) / 2,
          width: drawWidth,
          height: drawHeight
        });
      }
      const bytes = await output.save({ useObjectStreams: true });
      const blob = new Blob([bytes], { type: "application/pdf" });
      state.resultUrl = URL.createObjectURL(blob);
      const preview = $("#imagePdfPreview");
      preview.src = state.resultUrl;
      preview.hidden = false;
      $("#imagePdfDownload").disabled = false;
      status("PDF created successfully: " + state.items.length + " page(s), " + formatBytes(blob.size) + ". Review the preview or download it.", "success");
    } catch (error) {
      status(error.message || "Could not create the PDF. Try fewer or smaller images.", "error");
    } finally {
      state.busy = false;
      render();
      if (state.resultUrl) $("#imagePdfDownload").disabled = false;
    }
  }

  function download() {
    if (!state.resultUrl) return;
    const link = document.createElement("a");
    link.href = state.resultUrl;
    link.download = "toolnest-images-to-pdf.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    status("PDF download started.", "success");
  }

  function clear() {
    if (state.busy) return;
    state.items.forEach(revokeItem);
    state.items = [];
    revokeResult();
    $("#imagePdfFiles").value = "";
    status("All images and the generated PDF have been cleared.");
    render();
  }

  function init() {
    const input = $("#imagePdfFiles"), list = $("#imagePdfList"), drop = $("#imagePdfDrop");
    if (!input || !list || !drop) return;
    input.addEventListener("change", () => addFiles(input.files));
    list.addEventListener("click", event => {
      const button = event.target.closest("[data-action]");
      if (!button || state.busy) return;
      const id = button.dataset.id;
      if (button.dataset.action === "up") moveItem(id, -1);
      if (button.dataset.action === "down") moveItem(id, 1);
      if (button.dataset.action === "remove") removeItem(id);
    });
    drop.addEventListener("dragover", event => { event.preventDefault(); drop.classList.add("is-dragging"); });
    drop.addEventListener("dragleave", () => drop.classList.remove("is-dragging"));
    drop.addEventListener("drop", event => {
      event.preventDefault();
      drop.classList.remove("is-dragging");
      addFiles(event.dataTransfer?.files);
    });
    $("#imagePdfCreate").addEventListener("click", createPdf);
    $("#imagePdfDownload").addEventListener("click", download);
    $("#imagePdfClear").addEventListener("click", clear);
    [$("#imagePdfPageSize"), $("#imagePdfOrientation"), $("#imagePdfMargin")].forEach(control => {
      control.addEventListener("change", () => { revokeResult(); render(); status("Page settings updated. Create the PDF again to apply them."); });
    });
    render();
  }

  window.ToolNestImageToPdf = { init, clear, createPdf, download };
})();
