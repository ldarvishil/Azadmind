/**
<<<<<<< HEAD
 * HeroUI → Pure JS Component Helpers
 * Interactive behaviors for HeroUI Pure CSS components.
 * Provides: Accordion, Modal, Tabs, Tooltip, Switch, and Theme Toggle.
 */

(function (root) {
  "use strict";

  const HeroUI = {};

  /* ======================================================================
     Accordion
     ====================================================================== */

  HeroUI.Accordion = class {
    /**
     * @param {string|HTMLElement} selector - Accordion container selector or element.
     * @param {object} [options]
     * @param {boolean} [options.allowMultiple=false] - Allow multiple panels open.
     */
    constructor(selector, options = {}) {
      this.el =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      if (!this.el) return;

      this.allowMultiple = options.allowMultiple || false;
      this.triggers = this.el.querySelectorAll(".hui-accordion__trigger");

      this.triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => this._toggle(trigger));
      });
    }

    _toggle(trigger) {
      const item = trigger.closest(".hui-accordion__item");
      const panel = item.querySelector(".hui-accordion__panel");
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      if (!this.allowMultiple && !isOpen) {
        // Close all others first
        this.triggers.forEach((t) => {
          if (t !== trigger) {
            t.setAttribute("aria-expanded", "false");
            const p = t
              .closest(".hui-accordion__item")
              .querySelector(".hui-accordion__panel");
            if (p) {
              p.style.height = "0px";
              p.classList.remove("is-open");
            }
          }
        });
      }

      if (isOpen) {
        trigger.setAttribute("aria-expanded", "false");
        panel.style.height = panel.scrollHeight + "px";
        requestAnimationFrame(() => {
          panel.style.height = "0px";
          panel.classList.remove("is-open");
        });
      } else {
        trigger.setAttribute("aria-expanded", "true");
        panel.style.height = panel.scrollHeight + "px";
        panel.classList.add("is-open");
        panel.addEventListener(
          "transitionend",
          () => {
            if (trigger.getAttribute("aria-expanded") === "true") {
              panel.style.height = "auto";
            }
          },
          { once: true }
        );
      }
    }
  };

  /* ======================================================================
     Modal
     ====================================================================== */

  HeroUI.Modal = class {
    /**
     * @param {string|HTMLElement} selector - Modal backdrop element selector.
     */
    constructor(selector) {
      this.backdrop =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      if (!this.backdrop) return;

      // Bind close triggers
      const closeBtns = this.backdrop.querySelectorAll(
        ".hui-modal__close, [data-modal-close]"
      );
      closeBtns.forEach((btn) => {
        btn.addEventListener("click", () => this.close());
      });

      // Close on backdrop click
      this.backdrop.addEventListener("click", (e) => {
        if (e.target === this.backdrop) this.close();
      });

      // Close on Escape
      this._onKeyDown = (e) => {
        if (e.key === "Escape" && this.isOpen()) this.close();
      };
    }

    open() {
      this.backdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", this._onKeyDown);
      // Focus first focusable element inside modal
      const focusable = this.backdrop.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) setTimeout(() => focusable.focus(), 100);
    }

    close() {
      this.backdrop.classList.remove("is-open");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", this._onKeyDown);
    }

    isOpen() {
      return this.backdrop.classList.contains("is-open");
    }

    toggle() {
      this.isOpen() ? this.close() : this.open();
    }
  };

  /* ======================================================================
     Tabs
     ====================================================================== */

  HeroUI.Tabs = class {
    /**
     * @param {string|HTMLElement} selector - Tabs container selector.
     */
    constructor(selector) {
      this.el =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      if (!this.el) return;

      this.tabs = this.el.querySelectorAll(".hui-tabs__tab");
      this.panels = this.el.querySelectorAll(".hui-tabs__panel");

      this.tabs.forEach((tab, i) => {
        tab.addEventListener("click", () => this._select(i));
      });

      // Activate first tab by default if none active
      const hasActive = Array.from(this.tabs).some(
        (t) =>
          t.getAttribute("aria-selected") === "true" ||
          t.classList.contains("is-active")
      );
      if (!hasActive && this.tabs.length > 0) this._select(0);
    }

    _select(index) {
      this.tabs.forEach((tab, i) => {
        const isSelected = i === index;
        tab.setAttribute("aria-selected", isSelected ? "true" : "false");
        tab.classList.toggle("is-active", isSelected);
        tab.setAttribute("tabindex", isSelected ? "0" : "-1");
      });

      this.panels.forEach((panel, i) => {
        panel.hidden = i !== index;
      });
    }
  };

  /* ======================================================================
     Tooltip
     ====================================================================== */

  HeroUI.Tooltip = class {
    /**
     * @param {string} triggerSelector - Selector for elements with [data-tooltip].
     * @param {object} [options]
     * @param {number} [options.delay=500] - Show delay in ms.
     */
    constructor(triggerSelector = "[data-tooltip]", options = {}) {
      this.delay = options.delay || 500;

      document.querySelectorAll(triggerSelector).forEach((el) => {
        let timeout;
        const tooltipEl = document.createElement("div");
        tooltipEl.className = "hui-tooltip";
        tooltipEl.textContent = el.getAttribute("data-tooltip");
        document.body.appendChild(tooltipEl);

        el.addEventListener("mouseenter", () => {
          timeout = setTimeout(() => {
            const rect = el.getBoundingClientRect();
            tooltipEl.style.left =
              rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2 + "px";
            tooltipEl.style.top = rect.top - tooltipEl.offsetHeight - 8 + window.scrollY + "px";
            tooltipEl.classList.add("is-visible");
          }, this.delay);
        });

        el.addEventListener("mouseleave", () => {
          clearTimeout(timeout);
          tooltipEl.classList.remove("is-visible");
        });
      });
    }
  };

  /* ======================================================================
     Switch (toggle)
     ====================================================================== */

  HeroUI.initSwitches = function () {
    document.querySelectorAll(".hui-switch").forEach((switchEl) => {
      const checkbox = switchEl.querySelector('input[type="checkbox"]');
      if (!checkbox) return;

      // Sync initial state
      if (checkbox.checked) switchEl.classList.add("is-checked");

      checkbox.addEventListener("change", () => {
        switchEl.classList.toggle("is-checked", checkbox.checked);
      });
    });
  };

  /* ======================================================================
     Theme Toggle (Light / Dark)
     ====================================================================== */

  HeroUI.ThemeToggle = class {
    /**
     * @param {string|HTMLElement} toggleBtnSelector - Button element that toggles theme.
     * @param {object} [options]
     * @param {string} [options.storageKey="hui-theme"] - localStorage key.
     * @param {string} [options.defaultTheme="light"] - Default theme.
     */
    constructor(toggleBtnSelector, options = {}) {
      this.storageKey = options.storageKey || "hui-theme";
      this.defaultTheme = options.defaultTheme || "light";
      this.btn =
        typeof toggleBtnSelector === "string"
          ? document.querySelector(toggleBtnSelector)
          : toggleBtnSelector;

      // Apply saved theme
      const saved = localStorage.getItem(this.storageKey) || this.defaultTheme;
      this._applyTheme(saved);

      if (this.btn) {
        this.btn.addEventListener("click", () => this.toggle());
      }
    }

    _applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.classList.toggle("light", theme === "light");
      localStorage.setItem(this.storageKey, theme);
    }

    toggle() {
      const current =
        localStorage.getItem(this.storageKey) || this.defaultTheme;
      const next = current === "dark" ? "light" : "dark";
      this._applyTheme(next);
    }

    getTheme() {
      return localStorage.getItem(this.storageKey) || this.defaultTheme;
    }
  };

  /* ======================================================================
     Drawer
     ====================================================================== */

  HeroUI.Drawer = class {
    constructor(selector) {
      this.backdrop =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      if (!this.backdrop) return;

      // Close on backdrop click
      this.backdrop.addEventListener("click", (e) => {
        if (e.target === this.backdrop || e.target.classList.contains("hui-drawer-content")) {
          this.close();
        }
      });

      // Close button
      const closeBtn = this.backdrop.querySelector(".hui-drawer__close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.close());
      }

      // ESC key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.backdrop.classList.contains("is-open")) {
=======
 * HeroUI - Pure JavaScript Framework
 * A lightweight, dependency-free JavaScript framework for UI interactions
 * Version: 1.0.0
 */

(function(window) {
  'use strict';

  // ============================================
  // Utility Functions
  // ============================================
  
  function generateId() {
    return 'hui-' + Math.random().toString(36).substr(2, 9);
  }

  function createElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }

  // ============================================
  // Theme Toggle (Dark/Light Mode)
  // ============================================
  
  class ThemeToggle {
    constructor(storageKey = 'hui-theme') {
      this.storageKey = storageKey;
      this.init();
    }

    init() {
      const savedTheme = localStorage.getItem(this.storageKey);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    toggle() {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
      return isDark;
    }

    set(theme) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem(this.storageKey, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(this.storageKey, 'light');
      }
    }

    get() {
      return localStorage.getItem(this.storageKey) || 
             (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }

  // ============================================
  // Drawer (Mobile Navigation)
  // ============================================
  
  class Drawer {
    constructor(element, options = {}) {
      this.element = typeof element === 'string' ? document.querySelector(element) : element;
      if (!this.element) {
        console.error('HeroUI Drawer: Element not found');
        return;
      }
      
      this.options = {
        onOpen: options.onOpen || (() => {}),
        onClose: options.onClose || (() => {}),
        ...options
      };
      
      this.isOpen = false;
      this.backdrop = this.element;
      this.closeBtn = this.element.querySelector('.hui-drawer__close');
      
      this.bindEvents();
    }

    bindEvents() {
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }
      
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) {
          this.close();
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
>>>>>>> 5ddd495
          this.close();
        }
      });
    }

    open() {
<<<<<<< HEAD
      this.backdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    close() {
      this.backdrop.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    toggle() {
      this.backdrop.classList.contains("is-open") ? this.close() : this.open();
    }
  };

  /* ======================================================================
     Dropdown / Popover
     ====================================================================== */

  HeroUI.Dropdown = class {
    constructor(triggerSelector, popoverSelector) {
      this.trigger =
        typeof triggerSelector === "string"
          ? document.querySelector(triggerSelector)
          : triggerSelector;
      this.popover =
        typeof popoverSelector === "string"
          ? document.querySelector(popoverSelector)
          : popoverSelector;
      if (!this.trigger || !this.popover) return;

      this.trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggle();
      });

      document.addEventListener("click", (e) => {
        if (!this.popover.contains(e.target) && !this.trigger.contains(e.target)) {
          this.close();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.close();
      });
    }

    open() {
      this.popover.classList.add("is-open");
    }

    close() {
      this.popover.classList.remove("is-open");
    }

    toggle() {
      this.popover.classList.toggle("is-open");
    }
  };

  /* ======================================================================
     Toast
     ====================================================================== */

  HeroUI.Toast = class {
    constructor(regionSelector) {
      this.region =
        typeof regionSelector === "string"
          ? document.querySelector(regionSelector)
          : regionSelector;
      if (!this.region) {
        // Create default region
        this.region = document.createElement("div");
        this.region.className = "hui-toast-region hui-toast-region--bottom-end";
        document.body.appendChild(this.region);
      }
      this.toasts = [];
    }

    show({ title, description, variant, duration = 5000 }) {
      const toast = document.createElement("div");
      toast.className = `hui-toast${variant ? ` hui-toast--${variant}` : ""}`;
      toast.innerHTML = `
        <div class="hui-toast__content">
          <div class="hui-toast__title">${title || ""}</div>
          ${description ? `<div class="hui-toast__description">${description}</div>` : ""}
        </div>
        <button class="hui-close-btn hui-toast__close" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      `;

      this.region.appendChild(toast);

      // Trigger enter animation
      requestAnimationFrame(() => {
        toast.classList.add("is-visible");
      });

      // Close button
      const closeBtn = toast.querySelector(".hui-toast__close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this._dismiss(toast));
      }

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => this._dismiss(toast), duration);
      }

      this.toasts.push(toast);
      return toast;
    }

    _dismiss(toast) {
      toast.classList.remove("is-visible");
      toast.classList.add("is-exiting");
      setTimeout(() => {
        toast.remove();
        this.toasts = this.toasts.filter((t) => t !== toast);
      }, 400);
    }
  };

  /* ======================================================================
     Disclosure (single accordion item)
     ====================================================================== */

  HeroUI.Disclosure = class {
    constructor(selector) {
      this.el =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      if (!this.el) return;

      this.trigger = this.el.querySelector(".hui-disclosure__trigger");
      this.panel = this.el.querySelector(".hui-disclosure__panel");
      if (!this.trigger || !this.panel) return;

      this.trigger.addEventListener("click", () => this.toggle());
    }

    toggle() {
      const isOpen = this.trigger.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        this.trigger.setAttribute("aria-expanded", "false");
        this.panel.style.height = this.panel.scrollHeight + "px";
        requestAnimationFrame(() => {
          this.panel.style.height = "0";
          this.panel.classList.remove("is-open");
        });
      } else {
        this.trigger.setAttribute("aria-expanded", "true");
        this.panel.classList.add("is-open");
        this.panel.style.height = this.panel.scrollHeight + "px";
        this.panel.addEventListener(
          "transitionend",
          () => {
            this.panel.style.height = "auto";
          },
          { once: true }
        );
      }
    }
  };

  /* ======================================================================
     Slider
     ====================================================================== */

  HeroUI.Slider = class {
    constructor(selector) {
      this.el =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      if (!this.el) return;

      this.track = this.el.querySelector(".hui-slider__track");
      this.fill = this.el.querySelector(".hui-slider__fill");
      this.thumb = this.el.querySelector(".hui-slider__thumb");
      this.output = this.el.querySelector(".hui-slider__output");
      this.input = this.el.querySelector('input[type="range"]');

      if (!this.track || !this.thumb) return;

      this.min = parseFloat(this.input?.min || this.el.dataset.min || 0);
      this.max = parseFloat(this.input?.max || this.el.dataset.max || 100);
      this.value = parseFloat(this.input?.value || this.el.dataset.value || 50);

      if (this.input) {
        this.input.addEventListener("input", () => {
          this.value = parseFloat(this.input.value);
          this._update();
        });
      }

      this._update();
    }

    _update() {
      const pct = ((this.value - this.min) / (this.max - this.min)) * 100;
      if (this.fill) this.fill.style.width = pct + "%";
      if (this.thumb) this.thumb.style.left = pct + "%";
      if (this.output) this.output.textContent = this.value;
    }

    setValue(val) {
      this.value = Math.min(this.max, Math.max(this.min, val));
      if (this.input) this.input.value = this.value;
      this._update();
    }
  };

  /* ======================================================================
     NumberField
     ====================================================================== */

  HeroUI.NumberField = class {
    constructor(selector) {
      this.el =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      if (!this.el) return;

      this.input = this.el.querySelector(".hui-number-field__input");
      this.decBtn = this.el.querySelector('[data-action="decrement"]');
      this.incBtn = this.el.querySelector('[data-action="increment"]');

      if (!this.input) return;

      this.min = parseFloat(this.input.min || -Infinity);
      this.max = parseFloat(this.input.max || Infinity);
      this.step = parseFloat(this.input.step || 1);

      if (this.decBtn) {
        this.decBtn.addEventListener("click", () => this._change(-this.step));
      }
      if (this.incBtn) {
        this.incBtn.addEventListener("click", () => this._change(this.step));
      }

      this.input.addEventListener("change", () => this._clamp());
    }

    _change(delta) {
      const val = parseFloat(this.input.value || 0) + delta;
      this.input.value = Math.min(this.max, Math.max(this.min, val));
      this.input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    _clamp() {
      let val = parseFloat(this.input.value || 0);
      val = Math.min(this.max, Math.max(this.min, val));
      this.input.value = val;
    }
  };

  /* ======================================================================
     Select (Custom)
     ====================================================================== */

  HeroUI.Select = class {
    constructor(selector) {
      this.el =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      if (!this.el) return;

      this.trigger = this.el.querySelector(".hui-select");
      this.popover = this.el.querySelector(".hui-popover");
      this.valueEl = this.el.querySelector(".hui-select__value");

      if (!this.trigger || !this.popover) return;

      this.trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        this.popover.classList.toggle("is-open");
      });

      // Item selection
      this.popover.querySelectorAll(".hui-listbox-item, .hui-menu-item").forEach((item) => {
        item.addEventListener("click", () => {
          const val = item.dataset.value || item.textContent.trim();
          if (this.valueEl) this.valueEl.textContent = val;
          this.popover.classList.remove("is-open");
          this.el.dispatchEvent(new CustomEvent("change", { detail: { value: val } }));
        });
      });

      document.addEventListener("click", (e) => {
        if (!this.el.contains(e.target)) {
          this.popover.classList.remove("is-open");
        }
      });
    }
  };

  /* ======================================================================
     ToggleButton
     ====================================================================== */

  HeroUI.initToggleButtons = function () {
    document.querySelectorAll(".hui-toggle-btn").forEach((btn) => {
      if (btn.dataset.huiInit) return;
      btn.dataset.huiInit = "true";

      btn.addEventListener("click", () => {
        const pressed = btn.getAttribute("aria-pressed") === "true";
        btn.setAttribute("aria-pressed", String(!pressed));
        btn.classList.toggle("is-selected", !pressed);
      });
    });
  };

  /* ======================================================================
     Pagination
     ====================================================================== */

  HeroUI.Pagination = class {
    constructor(selector, options = {}) {
      this.el =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      if (!this.el) return;

      this.currentPage = options.currentPage || 1;
      this.totalPages = options.totalPages || 1;
      this.onChange = options.onChange || function () {};

      this.el.querySelectorAll(".hui-pagination__link:not(.hui-pagination__link--nav)").forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const page = parseInt(link.dataset.page || link.textContent.trim());
          if (!isNaN(page)) this.goTo(page);
        });
      });

      const prevBtn = this.el.querySelector('[data-action="prev"]');
      const nextBtn = this.el.querySelector('[data-action="next"]');

      if (prevBtn) prevBtn.addEventListener("click", (e) => { e.preventDefault(); this.goTo(this.currentPage - 1); });
      if (nextBtn) nextBtn.addEventListener("click", (e) => { e.preventDefault(); this.goTo(this.currentPage + 1); });
    }

    goTo(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;

      this.el.querySelectorAll(".hui-pagination__link").forEach((link) => {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      });

      const activeLink = this.el.querySelector(`[data-page="${page}"]`);
      if (activeLink) {
        activeLink.classList.add("is-active");
        activeLink.setAttribute("aria-current", "page");
      }

      this.onChange(page);
    }
  };

  /* ======================================================================
     InputOTP
     ====================================================================== */

  HeroUI.InputOTP = class {
    constructor(selector) {
      this.el =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      if (!this.el) return;

      this.inputs = this.el.querySelectorAll(".hui-input-otp__slot input");
      if (!this.inputs.length) return;

      this.inputs.forEach((input, idx) => {
        input.addEventListener("input", (e) => {
          const val = e.target.value;
          if (val && idx < this.inputs.length - 1) {
            this.inputs[idx + 1].focus();
          }
        });

        input.addEventListener("keydown", (e) => {
          if (e.key === "Backspace" && !input.value && idx > 0) {
            this.inputs[idx - 1].focus();
          }
        });

        input.addEventListener("paste", (e) => {
          e.preventDefault();
          const data = (e.clipboardData || window.clipboardData).getData("text");
          const chars = data.split("").slice(0, this.inputs.length - idx);
          chars.forEach((char, i) => {
            if (this.inputs[idx + i]) {
              this.inputs[idx + i].value = char;
            }
          });
          const next = Math.min(idx + chars.length, this.inputs.length - 1);
          this.inputs[next].focus();
        });
      });
    }

    getValue() {
      return Array.from(this.inputs)
        .map((i) => i.value)
        .join("");
    }
  };

  /* ======================================================================
     ScrollShadow
     ====================================================================== */

  HeroUI.ScrollShadow = class {
    constructor(selector) {
      this.el =
        typeof selector === "string"
          ? document.querySelector(selector)
          : selector;
      if (!this.el) return;

      this.el.addEventListener("scroll", () => this._update());
      this._update();
    }

    _update() {
      const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = this.el;
      const isVertical = this.el.classList.contains("hui-scroll-shadow--vertical");

      if (isVertical) {
        const atTop = scrollTop > 0;
        const atBottom = scrollTop + clientHeight < scrollHeight - 1;
        this.el.removeAttribute("data-top-scroll");
        this.el.removeAttribute("data-bottom-scroll");
        this.el.removeAttribute("data-top-bottom-scroll");
        if (atTop && atBottom) this.el.setAttribute("data-top-bottom-scroll", "true");
        else if (atTop) this.el.setAttribute("data-top-scroll", "true");
        else if (atBottom) this.el.setAttribute("data-bottom-scroll", "true");
      } else {
        const atLeft = scrollLeft > 0;
        const atRight = scrollLeft + clientWidth < scrollWidth - 1;
        this.el.removeAttribute("data-left-scroll");
        this.el.removeAttribute("data-right-scroll");
        this.el.removeAttribute("data-left-right-scroll");
        if (atLeft && atRight) this.el.setAttribute("data-left-right-scroll", "true");
        else if (atLeft) this.el.setAttribute("data-left-scroll", "true");
        else if (atRight) this.el.setAttribute("data-right-scroll", "true");
      }
    }
  };

  /* ======================================================================
     Auto-init on DOM Ready
     ====================================================================== */

  HeroUI.init = function () {
    // Auto-init switches
    HeroUI.initSwitches();

    // Auto-init toggle buttons
    HeroUI.initToggleButtons();

    // Auto-init accordions
    document.querySelectorAll(".hui-accordion").forEach((el) => {
      const allowMultiple = el.hasAttribute("data-allow-multiple");
      new HeroUI.Accordion(el, { allowMultiple });
    });

    // Auto-init tabs
    document.querySelectorAll(".hui-tabs").forEach((el) => {
      new HeroUI.Tabs(el);
    });

    // Auto-init tooltips
    if (document.querySelector("[data-tooltip]")) {
      new HeroUI.Tooltip();
    }

    // Auto-init drawers
    document.querySelectorAll(".hui-drawer-backdrop").forEach((el) => {
      new HeroUI.Drawer(el);
    });

    // Auto-init disclosures
    document.querySelectorAll(".hui-disclosure").forEach((el) => {
      new HeroUI.Disclosure(el);
    });

    // Auto-init scroll shadows
    document.querySelectorAll(".hui-scroll-shadow").forEach((el) => {
      new HeroUI.ScrollShadow(el);
    });

    // Auto-init number fields
    document.querySelectorAll(".hui-number-field").forEach((el) => {
      new HeroUI.NumberField(el);
    });

    // Auto-init input OTP
    document.querySelectorAll(".hui-input-otp").forEach((el) => {
      new HeroUI.InputOTP(el);
    });

    // Auto-init dropdowns with data attributes
    document.querySelectorAll("[data-dropdown-trigger]").forEach((trigger) => {
      const targetId = trigger.dataset.dropdownTrigger;
      const popover = document.getElementById(targetId);
      if (popover) new HeroUI.Dropdown(trigger, popover);
    });

    // Auto-init sliders with range input
    document.querySelectorAll(".hui-slider").forEach((el) => {
      new HeroUI.Slider(el);
    });
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => HeroUI.init());
  } else {
    HeroUI.init();
  }

  // Export
  root.HeroUI = HeroUI;
})(typeof window !== "undefined" ? window : this);
=======
      if (this.isOpen) return;
      
      this.backdrop.classList.add('hui-drawer-backdrop--open');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
      this.options.onOpen(this);
    }

    close() {
      if (!this.isOpen) return;
      
      this.backdrop.classList.remove('hui-drawer-backdrop--open');
      document.body.style.overflow = '';
      this.isOpen = false;
      this.options.onClose(this);
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
  }

  // ============================================
  // Toast Notifications
  // ============================================
  
  class Toast {
    constructor(containerSelector, options = {}) {
      this.container = typeof containerSelector === 'string' 
        ? document.querySelector(containerSelector) 
        : containerSelector;
      
      if (!this.container) {
        console.error('HeroUI Toast: Container not found');
        return;
      }
      
      this.options = {
        duration: options.duration || 5000,
        position: options.position || 'bottom-end',
        maxToasts: options.maxToasts || 5,
        ...options
      };
      
      this.toasts = [];
    }

    show({ title, description, variant = 'info', duration = this.options.duration, icon }) {
      const toastId = generateId();
      
      const toastHtml = `
        <div class="hui-toast hui-toast--${variant}" id="${toastId}" role="alert">
          <div class="hui-toast__header">
            ${icon || this.getDefaultIcon(variant)}
            <span class="hui-toast__title">${title}</span>
          </div>
          ${description ? `<p class="hui-toast__description">${description}</p>` : ''}
        </div>
      `;
      
      const toastElement = createElement(toastHtml);
      this.container.appendChild(toastElement);
      
      this.toasts.push({ id: toastId, element: toastElement });
      
      if (this.toasts.length > this.options.maxToasts) {
        this.remove(this.toasts[0].id);
      }
      
      const timeoutId = setTimeout(() => {
        this.remove(toastId);
      }, duration);
      
      toastElement.addEventListener('click', () => {
        clearTimeout(timeoutId);
        this.remove(toastId);
      });
      
      return toastId;
    }

    remove(toastId) {
      const toastIndex = this.toasts.findIndex(t => t.id === toastId);
      if (toastIndex === -1) return;
      
      const toast = this.toasts[toastIndex];
      toast.element.classList.add('hui-toast--closing');
      
      setTimeout(() => {
        if (toast.element.parentNode) {
          toast.element.parentNode.removeChild(toast.element);
        }
        this.toasts.splice(toastIndex, 1);
      }, 300);
    }

    clear() {
      this.toasts.forEach(toast => {
        toast.element.classList.add('hui-toast--closing');
        setTimeout(() => {
          if (toast.element.parentNode) {
            toast.element.parentNode.removeChild(toast.element);
          }
        }, 300);
      });
      this.toasts = [];
    }

    getDefaultIcon(variant) {
      const icons = {
        success: '<svg class="hui-toast__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
        error: '<svg class="hui-toast__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
        warning: '<svg class="hui-toast__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
        info: '<svg class="hui-toast__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
      };
      return icons[variant] || icons.info;
    }
  }

  // ============================================
  // Modal
  // ============================================
  
  class Modal {
    constructor(element, options = {}) {
      this.element = typeof element === 'string' ? document.querySelector(element) : element;
      if (!this.element) {
        console.error('HeroUI Modal: Element not found');
        return;
      }
      
      this.options = {
        onClose: options.onClose || (() => {}),
        onOpen: options.onOpen || (() => {}),
        closeOnBackdrop: options.closeOnBackdrop !== false,
        closeOnEsc: options.closeOnEsc !== false,
        ...options
      };
      
      this.isOpen = false;
      this.overlay = this.element.querySelector('[data-modal-overlay]') || this.element;
      this.closeBtns = this.element.querySelectorAll('[data-modal-close], .hui-modal__close');
      
      this.bindEvents();
    }

    bindEvents() {
      this.closeBtns.forEach(btn => {
        btn.addEventListener('click', () => this.close());
      });
      
      if (this.options.closeOnBackdrop) {
        this.overlay.addEventListener('click', (e) => {
          if (e.target === this.overlay) {
            this.close();
          }
        });
      }
      
      if (this.options.closeOnEsc) {
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.isOpen) {
            this.close();
          }
        });
      }
    }

    open() {
      if (this.isOpen) return;
      
      this.element.classList.remove('hidden');
      this.element.classList.add('flex');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
      this.options.onOpen(this);
    }

    close() {
      if (!this.isOpen) return;
      
      this.element.classList.add('hidden');
      this.element.classList.remove('flex');
      document.body.style.overflow = '';
      this.isOpen = false;
      this.options.onClose(this);
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
  }

  // ============================================
  // Accordion
  // ============================================
  
  class Accordion {
    constructor(element, options = {}) {
      this.element = typeof element === 'string' ? document.querySelector(element) : element;
      if (!this.element) {
        console.error('HeroUI Accordion: Element not found');
        return;
      }
      
      this.options = {
        allowMultiple: options.allowMultiple || false,
        onToggle: options.onToggle || (() => {}),
        ...options
      };
      
      this.headers = Array.from(this.element.querySelectorAll('[data-accordion-header], .hui-accordion__header'));
      this.contents = Array.from(this.element.querySelectorAll('[data-accordion-content], .hui-accordion__content'));
      
      this.bindEvents();
    }

    bindEvents() {
      this.headers.forEach((header, index) => {
        header.addEventListener('click', () => this.toggle(index));
      });
    }

    toggle(index) {
      const content = this.contents[index];
      const header = this.headers[index];
      if (!content) return;
      
      const isOpen = !content.classList.contains('hidden');
      
      if (!this.options.allowMultiple) {
        this.closeAll();
      }
      
      if (isOpen) {
        this.close(index);
      } else {
        this.open(index);
      }
      
      this.options.onToggle(index, !isOpen, this);
    }

    open(index) {
      const content = this.contents[index];
      const header = this.headers[index];
      if (!content) return;
      
      content.classList.remove('hidden');
      header.setAttribute('aria-expanded', 'true');
      header.classList.add('active');
    }

    close(index) {
      const content = this.contents[index];
      const header = this.headers[index];
      if (!content) return;
      
      content.classList.add('hidden');
      header.setAttribute('aria-expanded', 'false');
      header.classList.remove('active');
    }

    closeAll() {
      this.contents.forEach((content, index) => {
        this.close(index);
      });
    }

    openAll() {
      this.contents.forEach((content, index) => {
        this.open(index);
      });
    }
  }

  // ============================================
  // Tabs
  // ============================================
  
  class Tabs {
    constructor(element, options = {}) {
      this.element = typeof element === 'string' ? document.querySelector(element) : element;
      if (!this.element) {
        console.error('HeroUI Tabs: Element not found');
        return;
      }
      
      this.options = {
        defaultTab: options.defaultTab || 0,
        onChange: options.onChange || (() => {}),
        ...options
      };
      
      this.tabList = this.element.querySelector('[data-tab-list], .hui-tabs__list');
      this.panels = Array.from(this.element.querySelectorAll('[data-tab-panel], .hui-tabs__panel'));
      this.tabs = Array.from(this.tabList?.querySelectorAll('[data-tab], .hui-tab') || []);
      
      this.activeIndex = this.options.defaultTab;
      this.bindEvents();
      this.show(this.activeIndex);
    }

    bindEvents() {
      this.tabs.forEach((tab, index) => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          this.show(index);
        });
        
        tab.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const direction = e.key === 'ArrowLeft' ? 1 : -1;
            const newIndex = (this.activeIndex + direction + this.tabs.length) % this.tabs.length;
            this.show(newIndex);
            this.tabs[newIndex].focus();
          }
        });
      });
    }

    show(index) {
      if (index < 0 || index >= this.tabs.length) return;
      
      this.tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
        tab.setAttribute('aria-selected', i === index);
      });
      
      this.panels.forEach((panel, i) => {
        panel.classList.toggle('hidden', i !== index);
      });
      
      this.activeIndex = index;
      this.options.onChange(index, this);
    }

    getActiveIndex() {
      return this.activeIndex;
    }
  }

  // ============================================
  // Dropdown
  // ============================================
  
  class Dropdown {
    constructor(triggerElement, menuElement, options = {}) {
      this.trigger = typeof triggerElement === 'string' 
        ? document.querySelector(triggerElement) 
        : triggerElement;
      this.menu = typeof menuElement === 'string' 
        ? document.querySelector(menuElement) 
        : menuElement;
      
      if (!this.trigger || !this.menu) {
        console.error('HeroUI Dropdown: Trigger or menu not found');
        return;
      }
      
      this.options = {
        placement: options.placement || 'bottom-start',
        closeOnClickOutside: options.closeOnClickOutside !== false,
        closeOnEsc: options.closeOnEsc !== false,
        onOpen: options.onOpen || (() => {}),
        onClose: options.onClose || (() => {}),
        ...options
      };
      
      this.isOpen = false;
      this.bindEvents();
    }

    bindEvents() {
      this.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
      
      if (this.options.closeOnEsc) {
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.isOpen) {
            this.close();
          }
        });
      }
      
      if (this.options.closeOnClickOutside) {
        document.addEventListener('click', (e) => {
          if (this.isOpen && !this.trigger.contains(e.target) && !this.menu.contains(e.target)) {
            this.close();
          }
        });
      }
    }

    open() {
      if (this.isOpen) return;
      
      this.menu.classList.remove('hidden');
      this.trigger.setAttribute('aria-expanded', 'true');
      this.isOpen = true;
      this.options.onOpen(this);
    }

    close() {
      if (!this.isOpen) return;
      
      this.menu.classList.add('hidden');
      this.trigger.setAttribute('aria-expanded', 'false');
      this.isOpen = false;
      this.options.onClose(this);
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
  }

  // ============================================
  // Tooltip
  // ============================================
  
  class Tooltip {
    constructor(element, options = {}) {
      this.element = typeof element === 'string' ? document.querySelector(element) : element;
      if (!this.element) {
        console.error('HeroUI Tooltip: Element not found');
        return;
      }
      
      this.options = {
        content: options.content || this.element.getAttribute('data-tooltip') || this.element.title,
        placement: options.placement || 'top',
        delay: options.delay || 200,
        ...options
      };
      
      this.tooltip = null;
      this.timeout = null;
      this.bindEvents();
    }

    bindEvents() {
      this.element.addEventListener('mouseenter', () => this.show());
      this.element.addEventListener('mouseleave', () => this.hide());
      this.element.addEventListener('focus', () => this.show());
      this.element.addEventListener('blur', () => this.hide());
      
      this.element.removeAttribute('title');
    }

    show() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      
      this.timeout = setTimeout(() => {
        this.tooltip = createElement(`
          <div class="hui-tooltip" role="tooltip" style="position: absolute; z-index: 10000;">
            ${this.options.content}
          </div>
        `);
        
        document.body.appendChild(this.tooltip);
        this.updatePosition();
      }, this.options.delay);
    }

    hide() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      
      if (this.tooltip) {
        this.tooltip.remove();
        this.tooltip = null;
      }
    }

    updatePosition() {
      if (!this.tooltip) return;
      
      const rect = this.element.getBoundingClientRect();
      const tooltipRect = this.tooltip.getBoundingClientRect();
      
      let top, left;
      
      switch (this.options.placement) {
        case 'top':
          top = rect.top - tooltipRect.height - 8;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.right + 8;
          break;
        default:
          top = rect.top - tooltipRect.height - 8;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
      }
      
      this.tooltip.style.top = `${top}px`;
      this.tooltip.style.left = `${left}px`;
    }
  }

  // ============================================
  // Expose to Global Scope
  // ============================================
  
  window.HeroUI = {
    ThemeToggle,
    Drawer,
    Toast,
    Modal,
    Accordion,
    Tabs,
    Dropdown,
    Tooltip,
    version: '1.0.0'
  };

})(window);
>>>>>>> 5ddd495
