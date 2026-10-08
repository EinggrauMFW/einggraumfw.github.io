(function () {
  "use strict";

  // 1. Theme toggle
  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    function getEffectiveTheme() {
      return (
        document.documentElement.dataset.theme ||
        (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      );
    }

    function updateThemeBtn() {
      var next = getEffectiveTheme() === "dark" ? "light" : "dark";
      themeBtn.textContent = "[" + next + "]";
      themeBtn.setAttribute(
        "aria-label",
        next === "dark" ? "Switch to dark theme" : "Switch to light theme"
      );
    }

    themeBtn.removeAttribute("hidden");
    updateThemeBtn();

    themeBtn.addEventListener("click", function () {
      var next = getEffectiveTheme() === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      updateThemeBtn();
    });
  }

  // 2. Typing effect
  var h1 = document.querySelector("h1[data-type]");
  var reducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (h1 && !reducedMotion) {
    var fullText = h1.textContent.trim();
    if (fullText.length > 0) {
      h1.setAttribute("aria-label", fullText);
      h1.textContent = "";

      var textSpan = document.createElement("span");
      textSpan.setAttribute("aria-hidden", "true");

      var caret = document.createElement("span");
      caret.className = "caret";
      caret.setAttribute("aria-hidden", "true");
      caret.textContent = "_";

      h1.appendChild(textSpan);
      h1.appendChild(caret);

      var interval = Math.min(90, 1200 / fullText.length);
      var idx = 0;
      var timer = setInterval(function () {
        idx++;
        textSpan.textContent = fullText.slice(0, idx);
        if (idx >= fullText.length) {
          clearInterval(timer);
          setTimeout(function () {
            if (caret.parentNode) caret.parentNode.removeChild(caret);
          }, 1500);
        }
      }, interval);
    }
  }

  // 3. Status filter
  var filters = document.querySelector(".filters");
  if (filters) {
    filters.removeAttribute("hidden");
    var filterBtns = filters.querySelectorAll("button[data-filter]");
    var countEl = document.querySelector(".filter-count");
    var rows = Array.from(document.querySelectorAll("table.projects tbody tr"));
    var total = rows.length;

    filters.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      var filter = btn.getAttribute("data-filter");

      filterBtns.forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });

      var shown = 0;
      rows.forEach(function (row) {
        var status = row.getAttribute("data-status");
        var matches = filter === "all" || status === filter;
        row.hidden = !matches;
        if (matches) shown++;
      });

      if (countEl) countEl.textContent = shown + " of " + total + " shown";
    });
  }
})();

