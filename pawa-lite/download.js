(() => {
  "use strict";

  const invitation = "https://discord.gg/ZBfZSEGp39";
  const executorDownloadUrl = "https://github.com/Padawan986/Portfolio/raw/refs/heads/main/pawa-lite/external/PawaLite-Installer.zip";
  const externalDownloadUrl = "https://github.com/Padawan986/Portfolio/raw/refs/heads/main/Pawa-Lite-Installer-External.exe";

  // Modal Dialog Element
  const dialog = document.createElement("dialog");
  dialog.className = "download-dialog";
  dialog.setAttribute("aria-labelledby", "download-dialog-title");
  dialog.setAttribute("aria-describedby", "download-dialog-description");
  dialog.innerHTML = `
    <div class="download-dialog-content">
      <button class="download-dialog-close" type="button" aria-label="Close download popup">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
      </button>
      <img class="download-dialog-logo" src="/pawa-lite/assets/logo.png" onerror="this.src='/pawa-lite/assets/logo.png'" alt="" width="56" height="56">
      <h2 id="download-dialog-title">Discord Verification</h2>
      <p id="download-dialog-description">Joining our Discord server is required to download Pawa-Lite, get setup guidance, and receive updates.</p>
      
      <!-- STEP 1 & 2 CONTAINER -->
      <div id="download-steps" style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">
        <a id="btn-join-discord" class="download-dialog-primary" href="${invitation}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
          <svg viewBox="0 0 24 24" aria-hidden="true" style="fill:currentColor;stroke:none;"><path d="M19.5 5.3a18 18 0 0 0-4.4-1.4l-.6 1.2a16 16 0 0 0-5 0l-.6-1.2a18 18 0 0 0-4.4 1.4C1.7 9.4 1 13.4 1.4 17.3a18 18 0 0 0 5.4 2.7l1.1-1.8a11 11 0 0 1-1.7-.8l.4-.3a13 13 0 0 0 10.8 0l.4.3a11 11 0 0 1-1.7.8l1.1 1.8a18 18 0 0 0 5.4-2.7c.5-4.5-.8-8.4-3.1-12z"/></svg>
          <span>1. Join Discord Server</span>
          <span style="font-size: 12px; opacity: 0.8;">↗</span>
        </a>

        <button id="btn-proceed-download" class="download-dialog-primary" type="button" disabled style="background: #252531; color: #a1a1aa; border-color: #ffffff14; opacity: 0.5; cursor: not-allowed;">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4"/></svg>
          <span>2. Proceed to Download</span>
        </button>
      </div>

      <div class="download-dialog-links" style="margin-top: 20px;">
        <a class="download-dialog-discord" href="${invitation}" target="_blank" rel="noopener noreferrer">Need Help? Discord Community <span aria-hidden="true">↗</span></a>
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
  let closeTimer;

  function markDiscordJoined() {
    discordJoined = true;
    proceedBtn.disabled = false;
    proceedBtn.style.opacity = "1";
    proceedBtn.style.cursor = "pointer";
    proceedBtn.style.background = "#5865F2";
    proceedBtn.style.color = "#fff";
    proceedBtn.style.borderColor = "#ffffff24";
  }

  function resetDialog(product = "executor") {
    currentProduct = product;
    discordJoined = false;
    stepsContainer.style.display = "flex";
    
    proceedBtn.disabled = true;
    proceedBtn.style.opacity = "0.5";
    proceedBtn.style.cursor = "not-allowed";
    proceedBtn.style.background = "#252531";
    proceedBtn.style.color = "#a1a1aa";

    heading.textContent = "Discord Verification";
    const productName = product === "external" ? "Pawa-Lite External" : "Pawa-Lite Executor";
    description.textContent = `Joining our Discord server is required in order to download ${productName} and get the latest updates.`;
  }

  function startDownloadFile(url) {
    heading.textContent = "Download Starting";
    description.textContent = "Thanks for joining Pawa-Lite. Your installer download is starting now.";
    stepsContainer.style.display = "none";
    
    const triggerLink = document.createElement("a");
    triggerLink.href = url;
    triggerLink.setAttribute("download", "");
    document.body.appendChild(triggerLink);
    triggerLink.click();
    triggerLink.remove();

    setTimeout(() => {
      closePopup();
    }, 2200);
  }

  function openPopup(product = "executor") {
    if (dialog.open || closing) return;
    resetDialog(product);
    dialog.showModal();
  }

  function closePopup() {
    if (!dialog.open || closing) return;
    closing = true;
    dialog.classList.add("is-closing");
    closeTimer = window.setTimeout(() => {
      dialog.close();
      dialog.classList.remove("is-closing");
      closing = false;
    }, 240);
  }

  joinBtn.addEventListener("click", () => {
    markDiscordJoined();
  });

  proceedBtn.addEventListener("click", () => {
    if (!discordJoined) return;
    if (currentProduct === "external") {
      startDownloadFile(externalDownloadUrl);
    } else {
      startDownloadFile(executorDownloadUrl);
    }
  });

  closeBtn.addEventListener("click", closePopup);
  dialog.addEventListener("cancel", (e) => { e.preventDefault(); closePopup(); });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closePopup();
  });

  // Intercept all download triggers across the site
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || !(event.target instanceof Element)) return;
    const link = event.target.closest("a, button");
    if (!link || dialog.contains(link)) return;

    const href = link.getAttribute("href") || "";
    const isDownloadAction = href.includes("action=download") || href.includes("PawaLite-Installer") || href.includes("Pawa-Lite-Installer-External") || link.classList.contains("download-trigger") || link.textContent.includes("Download");
    
    if (!isDownloadAction) return;

    // Detect if external or executor
    const isExternal = window.location.pathname.includes("external") || href.includes("external") || href.includes("External") || link.textContent.includes("External");
    
    event.preventDefault();
    openPopup(isExternal ? "external" : "executor");
  });

  window.checkDiscord = function(product) {
    openPopup(product);
  };
})();
