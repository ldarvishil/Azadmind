/**
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
          this.close();
        }
      });
    }

    open() {
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
