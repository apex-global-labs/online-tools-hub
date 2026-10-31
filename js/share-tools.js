(() => {
  "use strict";
  const init = () => {
    const section = document.getElementById("share-toolnest");
    if (!section || section.dataset.ready === "true") return;
    section.dataset.ready = "true";
    const canonical = document.querySelector('link[rel="canonical"]')?.href || "https://apex-global-labs.github.io/online-tools-hub/";
    const shareUrl = canonical;
    const shareTitle = "ToolNest — Free Online Tools";
    const shareText = "Explore free online tools for text, images, coding and everyday calculations on ToolNest.";
    const status = document.getElementById("shareToolnestStatus");
    const whatsapp = document.getElementById("shareWhatsApp");
    const telegram = document.getElementById("shareTelegram");
    const payload = encodeURIComponent(shareText + " " + shareUrl);
    whatsapp.href = "https://wa.me/?text=" + payload;
    telegram.href = "https://t.me/share/url?url=" + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent(shareText);
    const copy = async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareUrl);
        } else {
          const field = document.createElement("textarea");
          field.value = shareUrl;
          field.setAttribute("readonly", "");
          field.style.position = "fixed";
          field.style.opacity = "0";
          document.body.appendChild(field);
          field.select();
          const copied = document.execCommand("copy");
          field.remove();
          if (!copied) throw new Error("Copy unavailable");
        }
        status.textContent = "Website link copied. You can paste it into a message or post.";
      } catch {
        status.textContent = "Copy is unavailable in this browser. Select the website address from your browser bar.";
      }
    };
    document.getElementById("copyToolnestButton").addEventListener("click", copy);
    document.getElementById("shareToolnestButton").addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
          status.textContent = "Thanks for sharing ToolNest.";
        } catch (error) {
          if (error?.name !== "AbortError") status.textContent = "Sharing was not available. Try a social link or copy the website link.";
        }
      } else {
        await copy();
      }
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
