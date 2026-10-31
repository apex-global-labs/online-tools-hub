(() => {
  "use strict";
  const root = window;
  const $ = (selector) => document.querySelector(selector);
  let latest = null;

  function status(text, isError = false) {
    const node = $("#bijoyConverterStatus");
    if (node) node.textContent = text;
    if (typeof root.message === "function") root.message(text, isError ? "error" : "success");
  }
  function updateCounts() {
    const unicode = $("#bijoyUnicodeInput");
    const bijoy = $("#bijoyAnsiInput");
    if (!unicode || !bijoy) return;
    $("#bijoyUnicodeCount").textContent = unicode.value.length.toLocaleString() + " characters";
    $("#bijoyAnsiCount").textContent = bijoy.value.length.toLocaleString() + " characters";
  }
  async function convert(direction) {
    const unicode = $("#bijoyUnicodeInput");
    const bijoy = $("#bijoyAnsiInput");
    const source = direction === "unicode-to-bijoy" ? unicode : bijoy;
    const target = direction === "unicode-to-bijoy" ? bijoy : unicode;
    const button = direction === "unicode-to-bijoy" ? $("#convertUnicodeToBijoy") : $("#convertBijoyToUnicode");
    if (!source.value.trim()) {
      status(direction === "unicode-to-bijoy" ? "Paste Unicode Bangla text first." : "Paste Bijoy ANSI text first.", true);
      source.focus();
      return;
    }
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Converting…";
    try {
      if (!root.ToolNestDocFix?.convertText) throw new Error("The Bangla conversion engine is not ready. Refresh the page and try again.");
      const result = await root.ToolNestDocFix.convertText(source.value, direction);
      target.value = result;
      target.classList.toggle("bijoy-ansi", direction === "unicode-to-bijoy");
      latest = direction === "unicode-to-bijoy" ? "bijoy" : "unicode";
      updateCounts();
      status(direction === "unicode-to-bijoy" ? "Unicode text converted to Bijoy ANSI. Review the result." : "Bijoy ANSI text converted to Unicode. Review the result.");
    } catch (error) {
      status(error?.message || "Conversion failed. Please check the text and try again.", true);
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  }
  async function copy(selector) {
    const node = $(selector);
    if (!node?.value) { status("There is no text to copy yet.", true); return; }
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard access is unavailable. Select and copy the text manually.");
      await navigator.clipboard.writeText(node.value);
      status("Text copied to clipboard.");
    } catch (error) { status(error.message || "Could not copy text.", true); }
  }
  function download(selector, filename) {
    const node = $(selector);
    if (!node?.value) { status("There is no text to download yet.", true); return; }
    const blob = new Blob([node.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    status("TXT download started.");
  }
  function clear() {
    const unicode = $("#bijoyUnicodeInput");
    const bijoy = $("#bijoyAnsiInput");
    if (unicode) { unicode.value = ""; unicode.classList.remove("bijoy-ansi"); }
    if (bijoy) { bijoy.value = ""; bijoy.classList.add("bijoy-ansi"); }
    latest = null;
    updateCounts();
    const node = $("#bijoyConverterStatus");
    if (node) node.textContent = "Ready. Paste Bangla text into either box to begin.";
  }
  function copyLatest() {
    if (latest === "unicode") return copy("#bijoyUnicodeInput");
    if (latest === "bijoy") return copy("#bijoyAnsiInput");
    status("Convert some text first, then use Copy result.", true);
  }
  function downloadLatest() {
    if (latest === "unicode") return download("#bijoyUnicodeInput", "toolnest-unicode.txt");
    if (latest === "bijoy") return download("#bijoyAnsiInput", "toolnest-bijoy-ansi.txt");
    status("Convert some text first, then use Download result.", true);
  }
  function init() {
    const unicode = $("#bijoyUnicodeInput");
    const bijoy = $("#bijoyAnsiInput");
    if (!unicode || !bijoy || unicode.dataset.ready === "true") return;
    unicode.dataset.ready = "true";
    bijoy.classList.add("bijoy-ansi");
    unicode.addEventListener("input", updateCounts);
    bijoy.addEventListener("input", updateCounts);
    $("#convertUnicodeToBijoy").addEventListener("click", () => convert("unicode-to-bijoy"));
    $("#convertBijoyToUnicode").addEventListener("click", () => convert("bijoy-to-unicode"));
    $("#copyUnicode").addEventListener("click", () => copy("#bijoyUnicodeInput"));
    $("#copyBijoy").addEventListener("click", () => copy("#bijoyAnsiInput"));
    $("#clearUnicode").addEventListener("click", () => { unicode.value = ""; updateCounts(); status("Unicode editor cleared."); });
    $("#clearBijoy").addEventListener("click", () => { bijoy.value = ""; updateCounts(); status("Bijoy editor cleared."); });
    $("#downloadUnicode").addEventListener("click", () => download("#bijoyUnicodeInput", "toolnest-unicode.txt"));
    $("#downloadBijoy").addEventListener("click", () => download("#bijoyAnsiInput", "toolnest-bijoy-ansi.txt"));
    $("#clearBothBijoy").addEventListener("click", clear);
    $("#swapBijoyText").addEventListener("click", () => {
      const grid = $(".bijoy-editor-grid");
      const cards = grid ? Array.from(grid.children) : [];
      if (cards.length === 2) grid.insertBefore(cards[1], cards[0]);
      status("Editor positions swapped. The Unicode and Bijoy text remain in their matching editors.");
    });
    updateCounts();
  }
  root.ToolNestBijoyConverter = { init, clear, copyLatest, downloadLatest, convert };
})();