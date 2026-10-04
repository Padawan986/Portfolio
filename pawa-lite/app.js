(() => {
  "use strict";

  const hostname = window.location.hostname;
  if (!/^https?:$/.test(window.location.protocol) || ["localhost", "127.0.0.1", "[::1]"].includes(hostname) || hostname.endsWith(".localhost")) return;

  // Vercel's native HTML integration; queue the privacy filter before loading it.
  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };
  window.va("beforeSend", (event) => {
    try {
      const url = new URL(event.url);
      url.search = "";
      url.hash = "";
      return { ...event, url: url.href };
    } catch {
      return null;
    }
  });

  if (document.head.querySelector('script[src="/_vercel/insights/script.js"]')) return;
  const script = document.createElement("script");
  script.src = "/_vercel/insights/script.js";
  script.defer = true;
  document.head.appendChild(script);
})();

(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector("#menu-toggle");
  const navigation = document.querySelector("#site-nav");
  const mobileNavigation = window.matchMedia("(max-width: 800px)");
  const menuBackground = Array.from(document.querySelectorAll("main, .site-footer"), (element) => ({ element, inert: element.inert }));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function onMotionPreferenceChange(callback) {
    if (typeof reducedMotion.addEventListener === "function") reducedMotion.addEventListener("change", callback);
    else if (typeof reducedMotion.addListener === "function") reducedMotion.addListener(callback);
  }

  const backgroundVideo = document.querySelector(".hero-background-video");
  if (backgroundVideo) {
    backgroundVideo.defaultPlaybackRate = 0.4;
    backgroundVideo.playbackRate = 0.4;
    function updateBackgroundMotion() {
      if (reducedMotion.matches || document.hidden) backgroundVideo.pause();
      else {
        backgroundVideo.playbackRate = 0.4;
        const playback = backgroundVideo.play();
        if (playback && typeof playback.catch === "function") playback.catch(() => {});
      }
    }
    onMotionPreferenceChange(updateBackgroundMotion);
    document.addEventListener("visibilitychange", updateBackgroundMotion);
    updateBackgroundMotion();
  }

  function setMenu(open, restoreFocus = false) {
    if (!menuButton || !navigation) return;
    const wasOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    navigation.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    menuBackground.forEach(({ element, inert }) => {
      element.inert = (open && mobileNavigation.matches) || inert;
    });
    if (restoreFocus && wasOpen) menuButton.focus();
  }

  if (menuButton && navigation) {
    function updateNavigationBreakpoint() {
      if (!mobileNavigation.matches) setMenu(false);
    }
    if (typeof mobileNavigation.addEventListener === "function") mobileNavigation.addEventListener("change", updateNavigationBreakpoint);
    else if (typeof mobileNavigation.addListener === "function") mobileNavigation.addListener(updateNavigationBreakpoint);
    updateNavigationBreakpoint();

    menuButton.addEventListener("click", () => {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("click", (event) => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenu(false, true);
        return;
      }
      if (event.key !== "Tab" || !mobileNavigation.matches || menuButton.getAttribute("aria-expanded") !== "true") return;
      const focusTargets = [menuButton, ...navigation.querySelectorAll("a[href]")].filter((element) => element.getClientRects().length > 0);
      const currentIndex = focusTargets.indexOf(document.activeElement);
      const nextIndex = currentIndex === -1
        ? (event.shiftKey ? focusTargets.length - 1 : 0)
        : (currentIndex + (event.shiftKey ? -1 : 1) + focusTargets.length) % focusTargets.length;
      event.preventDefault();
      focusTargets[nextIndex].focus();
    });
  }

  if (header) {
    let pending = false;
    function updateHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
      pending = false;
    }
    window.addEventListener("scroll", () => {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(updateHeader);
    }, { passive: true });
    updateHeader();
  }

  const heroPreview = document.querySelector(".hero-preview");
  const heroTiltSurface = document.querySelector(".hero-tilt-surface");
  const tiltAvailable = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 801px)");
  if (heroPreview && heroTiltSurface) {
    let tiltFrame;
    let previousFrameTime;
    let previewBounds;
    let targetX = 0;
    let targetY = 0;
    let targetScale = 1;
    let currentX = 0;
    let currentY = 0;
    let currentScale = 1;

    function writeTilt() {
      heroTiltSurface.style.setProperty("--tilt-x", `${currentX.toFixed(3)}deg`);
      heroTiltSurface.style.setProperty("--tilt-y", `${currentY.toFixed(3)}deg`);
      heroTiltSurface.style.setProperty("--tilt-scale", currentScale.toFixed(5));
    }

    function tiltAllowed() {
      return tiltAvailable.matches && !reducedMotion.matches && !document.hidden;
    }

    function resetTilt(immediate = false) {
      targetX = 0;
      targetY = 0;
      targetScale = 1;
      previewBounds = undefined;
      if (immediate || !tiltAllowed()) {
        if (tiltFrame) window.cancelAnimationFrame(tiltFrame);
        tiltFrame = undefined;
        previousFrameTime = undefined;
        currentX = 0;
        currentY = 0;
        currentScale = 1;
        writeTilt();
      } else if (!tiltFrame) {
        tiltFrame = window.requestAnimationFrame(updateTilt);
      }
    }

    function updateTilt(timestamp) {
      tiltFrame = undefined;
      if (!tiltAllowed()) {
        resetTilt(true);
        return;
      }
      const elapsed = previousFrameTime ? Math.min(timestamp - previousFrameTime, 50) : 16.7;
      previousFrameTime = timestamp;
      const easing = 1 - Math.exp(-elapsed / 85);
      currentX += (targetX - currentX) * easing;
      currentY += (targetY - currentY) * easing;
      currentScale += (targetScale - currentScale) * easing;
      const settled = Math.abs(targetX - currentX) < 0.003
        && Math.abs(targetY - currentY) < 0.003
        && Math.abs(targetScale - currentScale) < 0.00003;
      if (settled) {
        currentX = targetX;
        currentY = targetY;
        currentScale = targetScale;
        previousFrameTime = undefined;
      }
      writeTilt();
      if (!settled) tiltFrame = window.requestAnimationFrame(updateTilt);
    }

    function moveTilt(event) {
      if (!tiltAllowed() || event.pointerType === "touch") return;
      // Measure the outer figure rather than the surface being transformed.
      if (!previewBounds) previewBounds = heroPreview.getBoundingClientRect();
      if (!previewBounds.width || !previewBounds.height) return;
      const horizontal = Math.max(-1, Math.min(1, (event.clientX - previewBounds.left) / previewBounds.width * 2 - 1));
      const vertical = Math.max(-1, Math.min(1, (event.clientY - previewBounds.top) / previewBounds.height * 2 - 1));
      targetX = -vertical * 5;
      targetY = horizontal * 5;
      targetScale = 1.015;
      if (!tiltFrame) tiltFrame = window.requestAnimationFrame(updateTilt);
    }

    heroPreview.addEventListener("pointerenter", moveTilt);
    heroPreview.addEventListener("pointermove", moveTilt);
    heroPreview.addEventListener("pointerleave", () => resetTilt());
    heroPreview.addEventListener("pointercancel", () => resetTilt());
    window.addEventListener("scroll", () => resetTilt(true), { passive: true });
    window.addEventListener("resize", () => resetTilt(true), { passive: true });
    document.addEventListener("visibilitychange", () => resetTilt(true));
    onMotionPreferenceChange(() => resetTilt(true));
    if (typeof tiltAvailable.addEventListener === "function") tiltAvailable.addEventListener("change", () => resetTilt(true));
    else if (typeof tiltAvailable.addListener === "function") tiltAvailable.addListener(() => resetTilt(true));
    if ("IntersectionObserver" in window) {
      const tiltVisibility = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) resetTilt(true);
      });
      tiltVisibility.observe(heroPreview);
    }
  }

  const revealElements = Array.from(document.querySelectorAll(
    ".section-heading, .feature-card, .preview-tabs, .full-preview, .preview-caption, .step, .community-panel, .closing .shell, .footer-main"
  ));
  const siblingCounts = new Map();
  revealElements.forEach((element) => {
    element.setAttribute("data-reveal", "");
    const index = siblingCounts.get(element.parentElement) || 0;
    element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 210)}ms`);
    siblingCounts.set(element.parentElement, index + 1);
  });

  let revealObserver;
  function revealElement(element, immediate = false) {
    if (immediate) element.style.setProperty("--reveal-delay", "0ms");
    element.classList.add("is-revealed");
    if (revealObserver) revealObserver.unobserve(element);
  }

  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) revealElement(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    // Mark current and previous viewport content before enabling hidden initial states.
    revealElements.forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) revealElement(element, true);
      else revealObserver.observe(element);
    });
    document.documentElement.classList.add("motion-enabled");
  } else {
    revealElements.forEach((element) => revealElement(element, true));
  }

  document.addEventListener("focusin", (event) => {
    let element = event.target;
    while (element && element instanceof Element) {
      if (element.hasAttribute("data-reveal")) revealElement(element, true);
      element = element.parentElement;
    }
  });
  onMotionPreferenceChange(() => {
    if (!reducedMotion.matches) return;
    document.documentElement.classList.remove("motion-enabled");
    if (revealObserver) revealObserver.disconnect();
    revealElements.forEach((element) => revealElement(element, true));
  });

  const views = {
    editor: {
      source: "assets/editor-hd.png",
      alt: "Pawa-Lite script editor interface",
      caption: "Script editor",
      width: 871,
      height: 441
    },
    library: {
      source: "assets/editor-hd.png",
      alt: "Pawa-Lite script library interface",
      caption: "Script library",
      width: 871,
      height: 441
    },
    settings: {
      source: "assets/editor-hd.png",
      alt: "Pawa-Lite settings interface",
      caption: "Settings",
      width: 874,
      height: 443
    }
  };
  const tabs = Array.from(document.querySelectorAll("[data-preview]"));
  const panel = document.querySelector("#preview-panel");
  const image = document.querySelector("#preview-image");
  const caption = document.querySelector("#preview-caption");
  const imageStack = image && image.closest(".preview-image-stack");
  const imageCache = new Map();
  let previewRevision = 0;
  let displayedView = tabs.find((tab) => tab.getAttribute("aria-selected") === "true")?.dataset.preview || "editor";
  let outgoingImage;
  let previewAnimations = [];
  let cacheWarmed = false;

  function setSelectedTab(tab) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.dataset.active = String(selected);
      item.tabIndex = selected ? 0 : -1;
    });
    if (panel && tab.id) panel.setAttribute("aria-labelledby", tab.id);
  }

  function finishPreviewTransition() {
    previewAnimations.forEach((animation) => animation.cancel());
    previewAnimations = [];
    if (outgoingImage) outgoingImage.remove();
    outgoingImage = undefined;
  }

  function loadPreview(view) {
    if (imageCache.has(view.source)) return imageCache.get(view.source);
    const ready = new Promise((resolve) => {
      const capture = new Image();
      capture.decoding = "async";
      capture.onload = async () => {
        try {
          if (typeof capture.decode === "function") await capture.decode();
          resolve(capture);
        } catch (_) {
          resolve(capture);
        }
      };
      capture.onerror = () => {
        const fallback = new Image();
        fallback.src = "assets/editor-hd.png";
        fallback.onload = () => resolve(fallback);
        fallback.onerror = () => resolve(capture);
      };
      capture.src = view.source;
    });
    imageCache.set(view.source, ready);
    return ready;
  }

  function warmPreviewCache() {
    if (cacheWarmed) return;
    cacheWarmed = true;
    Object.values(views).forEach((view) => loadPreview(view).catch(() => {}));
  }

  async function selectPreview(tab, focus = false) {
    const key = tab.dataset.preview;
    const view = views[key];
    if (!view) return;
    const revision = ++previewRevision;
    setSelectedTab(tab);
    if (focus) tab.focus();
    if (!image || displayedView === key) {
      finishPreviewTransition();
      if (panel) panel.removeAttribute("aria-busy");
      if (caption) caption.textContent = view.caption;
      return;
    }
    if (panel) panel.setAttribute("aria-busy", "true");

    try {
      // Keep the current capture visible until the next image is loaded and decoded.
      const readyCapture = await loadPreview(view);
      if (revision !== previewRevision) return;
      finishPreviewTransition();
      const animate = imageStack && !reducedMotion.matches && !document.hidden && typeof image.animate === "function";
      if (animate) {
        outgoingImage = image.cloneNode(false);
        outgoingImage.removeAttribute("id");
        outgoingImage.removeAttribute("loading");
        outgoingImage.removeAttribute("fetchpriority");
        outgoingImage.setAttribute("aria-hidden", "true");
        outgoingImage.alt = "";
        // An interrupted load may have changed the base element; use the last committed capture.
        outgoingImage.src = views[displayedView].source;
        outgoingImage.classList.add("preview-image-outgoing");
        imageStack.append(outgoingImage);
      }
      image.src = readyCapture.src;
      image.alt = view.alt;
      image.width = view.width;
      image.height = view.height;
      displayedView = key;
      if (typeof image.decode === "function") await image.decode().catch(() => {});
      if (revision !== previewRevision) return;
      if (caption) caption.textContent = view.caption;
      if (panel) panel.removeAttribute("aria-busy");
      if (!animate || reducedMotion.matches || document.hidden || !outgoingImage) {
        finishPreviewTransition();
        return;
      }

      const oldCapture = outgoingImage;
      const timing = { duration: 460, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" };
      const fadeOut = oldCapture.animate([{ opacity: 1 }, { opacity: 0 }], timing);
      const fadeIn = image.animate([
        { transform: "translateY(3px)" },
        { transform: "translateY(0)" }
      ], timing);
      previewAnimations = [fadeOut, fadeIn];
      Promise.all(previewAnimations.map((animation) => animation.finished)).then(() => {
        if (outgoingImage === oldCapture) finishPreviewTransition();
      }).catch(() => {});
    } catch (_) {
      if (revision !== previewRevision) return;
      const previousTab = tabs.find((item) => item.dataset.preview === displayedView);
      if (previousTab) setSelectedTab(previousTab);
      if (caption) caption.textContent = views[displayedView].caption;
      if (panel) panel.removeAttribute("aria-busy");
      finishPreviewTransition();
    }
  }

  onMotionPreferenceChange(() => {
    if (reducedMotion.matches) finishPreviewTransition();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) finishPreviewTransition();
  });

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      warmPreviewCache();
      selectPreview(tab);
    });
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      warmPreviewCache();
      selectPreview(tabs[next], true);
    });
  });
  if (tabs.length) selectPreview(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);

  const year = document.querySelector("#copyright-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
