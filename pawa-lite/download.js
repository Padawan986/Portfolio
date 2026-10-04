(() => {
  "use strict";

  const invitation = "https://discord.gg/ZBfZSEGp39";
  const executorDownloadUrl = "https://github.com/Padawan986/Portfolio/raw/refs/heads/main/pawa-lite/executor/PawaLite-Installer.zip";
  const externalDownloadUrl = "https://github.com/Padawan986/Portfolio/raw/refs/heads/main/Pawa-Lite-Installer-External.exe";

  // Create modal dialog
  const dialog = document.createElement("dialog");
  dialog.className = "download-dialog";
  dialog.setAttribute("aria-labelledby", "download-dialog-title");
  dialog.setAttribute("aria-describedby", "download-dialog-description");
  dialog.innerHTML = `
    <div class="download-dialog-content">
      <button class="download-dialog-close" type="button" aria-label="Close download popup">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
      </button>
      <img class="download-dialog-logo" src="/pawa-lite/assets/logo.png" alt="" width="56" height="56">
      <h2 id="download-dialog-title">Discord Verification</h2>
      <p id="download-dialog-description">Joining our Discord server is required to download Pawa-Lite.</p>
      
      <div id="download-steps" style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">
        <a id="btn-join-discord" class="download-dialog-primary" href="${invitation}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
          <svg viewBox="0 0 24 24" aria-hidden="true" style="fill:currentColor;stroke:none;"><path d="M19.5 5.3a18 18 0 0 0-4.4-1.4l-.6 1.2a16 16 0 0 0-5 0l-.6-1.2a18 18 0 0 0-4.4 1.4C1.7 9.4 1 13.4 1.4 17.3a18 18 0 0 0 5.4 2.7l1.1-1.8a11 11 0 0 1-1.7-.8l.4-.3a13 13 0 0 0 10.8 0l.4.3a11 11 0 0 1-1.7.8l1.1 1.8a18 18 0 0 0 5.4-2.7c.5-4.5-.8-8.4-3.1-12z"/></svg>
          <span>1. Join Discord Server</span>
        </a>
        <button id="btn-proceed-download" class="download-dialog-primary" type="button" disabled style="background: #252531; color: #a1a1aa; border-color: #ffffff14; opacity: 0.5; cursor: not-allowed;">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4"/></svg>
          <span>2. Proceed to Download</span>
        </button>
      </div>

      <div class="download-dialog-links" style="margin-top: 20px;">
        <a class="download-dialog-discord" href="${invitation}" target="_blank" rel="noopener noreferrer">Need Help? Discord Community</a>
      </div>
    </div>`;
  document.body.appendChild(dialog);

  const heading = dialog.querySelector("h2");
  const description = dialog.querySelector("#download-dialog-description");
  const stepsContainer = dialog.querySelector("#download-steps");
  const joinBtn = dialog.querySelector("#btn-join-discord");
  const proceedBtn = dialog.querySelector("#btn-proceed-download");
  const closeBtn = dialog.querySelector(".download-dialog-close");

  let discordJoined = false;
  let currentProduct = "executor";
  let closing = false;

  function markDiscordJoined() {
    discordJoined = true;
    proceedBtn.disabled = false;
    proceedBtn.style.opacity = "1";
    proceedBtn.style.cursor = "pointer";
    proceedBtn.style.background = "#5865F2";
    proceedBtn.style.color = "#fff";
    proceedBtn.style.borderColor = "#ffffff24";
  }

  function resetDialog(product) {
    currentProduct = product || "executor";
    discordJoined = false;
    stepsContainer.style.display = "flex";
    proceedBtn.disabled = true;
    proceedBtn.style.opacity = "0.5";
    proceedBtn.style.cursor = "not-allowed";
    proceedBtn.style.background = "#252531";
    proceedBtn.style.color = "#a1a1aa";
    heading.textContent = "Discord Verification";
    const name = currentProduct === "external" ? "Pawa-Lite External" : "Pawa-Lite Executor";
    description.textContent = "Joining our Discord server is required to download " + name + ".";
  }

  function startDownloadFile(url) {
    heading.textContent = "Download Starting";
    description.textContent = "Your download is starting now.";
    stepsContainer.style.display = "none";
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "");
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(closePopup, 2200);
  }

  function openPopup(product) {
    if (dialog.open || closing) return;
    resetDialog(product);
    dialog.showModal();
  }

  function closePopup() {
    if (!dialog.open || closing) return;
    closing = true;
    dialog.classList.add("is-closing");
    setTimeout(() => {
      dialog.close();
      dialog.classList.remove("is-closing");
      closing = false;
    }, 240);
  }

  joinBtn.addEventListener("click", () => { markDiscordJoined(); });

  proceedBtn.addEventListener("click", () => {
    if (!discordJoined) return;
    startDownloadFile(currentProduct === "external" ? externalDownloadUrl : executorDownloadUrl);
  });

  closeBtn.addEventListener("click", closePopup);
  dialog.addEventListener("cancel", (e) => { e.preventDefault(); closePopup(); });
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) closePopup();
  });

  // MAIN: Intercept ANY click on [data-download] elements
  document.addEventListener("click", function(e) {
    const el = e.target.closest("[data-download]");
    if (el && !dialog.contains(el)) {
      e.preventDefault();
      e.stopPropagation();
      openPopup(el.getAttribute("data-download"));
      return;
    }
  }, true);

  window.checkDiscord = function(product) { openPopup(product); };
})();