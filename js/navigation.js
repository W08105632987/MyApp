// Navigation and Page Management for MonieKing

// Page navigation state
const navigationState = {
  currentPage: "",
  previousPage: "",
  navigationHistory: [],
};

// Initialize navigation
document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
});

function initializeNavigation() {
  // Get current page
  navigationState.currentPage = getCurrentPage();

  // Add to history
  navigationState.navigationHistory.push(navigationState.currentPage);

  // Setup navigation listeners
  setupNavigationListeners();

  // Setup page transitions
  setupPageTransitions();

  // Update active navigation items
  updateActiveNavItems();
}

// Get current page name
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split("/").pop().replace(".html", "") || "index";
  return page;
}

// Setup navigation event listeners
function setupNavigationListeners() {
  // Handle bottom navigation clicks
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function (e) {
      // Add click animation
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 100);
    });
  });

  // Handle back navigation
  document.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      navigateBack();
    });
  });

  // Handle page links with transition
  document.querySelectorAll("[data-page]").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetPage = this.getAttribute("data-page");
      navigateToPage(targetPage);
    });
  });
}

// Setup page transition animations
function setupPageTransitions() {
  // Add page enter animation
  const pageContent = document.querySelector(".page-content");
  if (pageContent) {
    pageContent.style.opacity = "0";
    pageContent.style.transform = "translateY(20px)";

    setTimeout(() => {
      pageContent.style.transition = "all 0.4s ease";
      pageContent.style.opacity = "1";
      pageContent.style.transform = "translateY(0)";
    }, 100);
  }
}

// Update active navigation items
function updateActiveNavItems() {
  const currentPage = getCurrentPage();

  // Update bottom nav
  document.querySelectorAll(".nav-item").forEach((item) => {
    const href = item.getAttribute("href");
    if (href && href.includes(currentPage)) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Update filter buttons if any
  document.querySelectorAll(".filter-btn[data-page]").forEach((btn) => {
    if (btn.dataset.page === currentPage) {
      btn.classList.add("active");
    }
  });
}

// Navigate to a specific page with animation
function navigateToPage(pageName, options = {}) {
  const {
    transition = "fade",
    duration = 300,
    beforeNavigate = null,
    afterNavigate = null,
  } = options;

  // Call before navigate callback
  if (beforeNavigate && typeof beforeNavigate === "function") {
    beforeNavigate();
  }

  // Store current page as previous
  navigationState.previousPage = navigationState.currentPage;

  // Apply exit animation
  const pageElement = document.querySelector(
    ".page, .auth-page, .landing-page"
  );
  if (pageElement) {
    switch (transition) {
      case "fade":
        pageElement.style.opacity = "0";
        break;
      case "slide-left":
        pageElement.style.transform = "translateX(-100%)";
        break;
      case "slide-right":
        pageElement.style.transform = "translateX(100%)";
        break;
      case "slide-up":
        pageElement.style.transform = "translateY(-100%)";
        break;
      default:
        pageElement.style.opacity = "0";
    }
  }

  // Navigate after animation
  setTimeout(() => {
    const url = pageName.endsWith(".html") ? pageName : `${pageName}.html`;
    window.location.href = url;

    // Call after navigate callback
    if (afterNavigate && typeof afterNavigate === "function") {
      afterNavigate();
    }
  }, duration);
}

// Navigate back to previous page
function navigateBack() {
  if (navigationState.navigationHistory.length > 1) {
    // Remove current page
    navigationState.navigationHistory.pop();

    // Get previous page
    const previousPage =
      navigationState.navigationHistory[
        navigationState.navigationHistory.length - 1
      ];

    // Navigate with slide animation
    navigateToPage(previousPage, { transition: "slide-right" });
  } else {
    // Default back to dashboard
    navigateToPage("dashboard", { transition: "slide-right" });
  }
}

// Smooth scroll to section
function scrollToSection(sectionId, offset = 0) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const targetPosition = element.offsetTop - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 600;
  let start = null;

  function animation(currentTime) {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// Handle tab navigation
function setupTabs(tabContainerId) {
  const tabContainer = document.getElementById(tabContainerId);
  if (!tabContainer) return;

  const tabs = tabContainer.querySelectorAll("[data-tab]");
  const contents = tabContainer.querySelectorAll("[data-tab-content]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Show target content
      contents.forEach((content) => {
        if (content.getAttribute("data-tab-content") === targetTab) {
          content.classList.remove("hidden");
          content.style.animation = "fadeIn 0.3s ease";
        } else {
          content.classList.add("hidden");
        }
      });
    });
  });
}

// Breadcrumb navigation
function createBreadcrumb(items) {
  const breadcrumb = document.createElement("nav");
  breadcrumb.className = "breadcrumb";
  breadcrumb.setAttribute("aria-label", "Breadcrumb");

  const list = document.createElement("ol");
  list.style.cssText =
    "display: flex; gap: 0.5rem; list-style: none; padding: 0.5rem 0; font-size: 0.875rem;";

  items.forEach((item, index) => {
    const listItem = document.createElement("li");

    if (index < items.length - 1) {
      const link = document.createElement("a");
      link.href = item.url;
      link.textContent = item.label;
      link.style.color = "var(--primary-blue)";
      listItem.appendChild(link);

      const separator = document.createElement("span");
      separator.textContent = " / ";
      separator.style.color = "var(--text-muted)";
      listItem.appendChild(separator);
    } else {
      listItem.textContent = item.label;
      listItem.style.color = "var(--text-dark)";
      listItem.style.fontWeight = "600";
    }

    list.appendChild(listItem);
  });

  breadcrumb.appendChild(list);
  return breadcrumb;
}

// Mobile menu toggle
function setupMobileMenu() {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener("click", function () {
    const isOpen = mobileMenu.classList.contains("open");

    if (isOpen) {
      mobileMenu.classList.remove("open");
      mobileMenu.style.transform = "translateX(100%)";
    } else {
      mobileMenu.classList.add("open");
      mobileMenu.style.transform = "translateX(0)";
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      mobileMenu.classList.remove("open");
      mobileMenu.style.transform = "translateX(100%)";
    }
  });
}

// Handle swipe gestures for mobile navigation
function setupSwipeNavigation() {
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  });

  function handleSwipeGesture() {
    const swipeThreshold = 100;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swipe right - go back
        const backButton = document.querySelector('[href*="dashboard"]');
        if (backButton && getCurrentPage() !== "dashboard") {
          navigateBack();
        }
      }
    }
  }
}

// Keyboard navigation
function setupKeyboardNavigation() {
  document.addEventListener("keydown", function (e) {
    // ESC key - close modals
    if (e.key === "Escape") {
      const modal = document.getElementById("modal-overlay");
      if (modal) {
        closeModal();
      }
    }

    // Ctrl/Cmd + K - focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.focus();
      }
    }

    // Alt + 1-4 - navigate to main pages
    if (e.altKey) {
      switch (e.key) {
        case "1":
          navigateToPage("dashboard");
          break;
        case "2":
          navigateToPage("transactions");
          break;
        case "3":
          navigateToPage("shop");
          break;
        case "4":
          navigateToPage("settings");
          break;
      }
    }
  });
}

// Initialize all navigation features
setupSwipeNavigation();
setupKeyboardNavigation();
setupMobileMenu();

// Export navigation utilities
window.Navigation = {
  navigateToPage,
  navigateBack,
  scrollToSection,
  setupTabs,
  createBreadcrumb,
  getCurrentPage,
  navigationState,
};

console.log("Navigation System Initialized ✓");
