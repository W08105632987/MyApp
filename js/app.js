// Main Application JavaScript for MonieKing

// Initialize app on page load
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

// Initialize application
function initializeApp() {
  // Add page load animation
  document.body.classList.add("fade-in");

  // Check authentication for protected pages
  checkAuth();

  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Handle form submissions globally
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", function (e) {
      // Don't prevent default here - let individual forms handle it
      // Just add visual feedback
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        setTimeout(() => (submitBtn.disabled = false), 2000);
      }
    });
  });

  // Add input animations
  document
    .querySelectorAll(".form-input, .form-select, .form-textarea")
    .forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("input-focused");
      });

      input.addEventListener("blur", function () {
        this.parentElement.classList.remove("input-focused");
      });
    });

  // Handle offline/online status
  window.addEventListener("online", () => {
    showAlert("Connection restored", "success");
  });

  window.addEventListener("offline", () => {
    showAlert("No internet connection", "warning");
  });
}

// Check authentication
function checkAuth() {
  const protectedPages = [
    "dashboard.html",
    "send-money.html",
    "receive-money.html",
    "convert.html",
    "shop.html",
    "transactions.html",
    "settings.html",
  ];

  const currentPage = window.location.pathname.split("/").pop();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (protectedPages.includes(currentPage) && !isLoggedIn) {
    // Redirect to login
    window.location.href = "login.html";
  }

  // Redirect to dashboard if already logged in and on auth pages
  const authPages = ["login.html", "register.html", "index.html"];
  if (authPages.includes(currentPage) && isLoggedIn) {
    // Only redirect if explicitly navigating to these pages
    // Don't redirect on page load to avoid loops
    if (
      document.referrer &&
      !authPages.some((page) => document.referrer.includes(page))
    ) {
      window.location.href = "dashboard.html";
    }
  }
}

// Session management
function checkSession() {
  const lastActivity = localStorage.getItem("lastActivity");
  const sessionTimeout = 30 * 60 * 1000; // 30 minutes

  if (lastActivity) {
    const timeSinceActivity = Date.now() - parseInt(lastActivity);

    if (timeSinceActivity > sessionTimeout) {
      // Session expired
      localStorage.clear();
      window.location.href = "login.html";
      showAlert("Session expired. Please login again.", "warning");
      return false;
    }
  }

  // Update last activity
  localStorage.setItem("lastActivity", Date.now().toString());
  return true;
}

// Update session on user activity
["click", "keypress", "scroll", "mousemove"].forEach((event) => {
  document.addEventListener(
    event,
    debounce(() => {
      if (localStorage.getItem("isLoggedIn") === "true") {
        localStorage.setItem("lastActivity", Date.now().toString());
      }
    }, 1000)
  );
});

// Check session every minute
setInterval(checkSession, 60000);

// Currency formatting helper (if not loaded from mock-data)
if (typeof formatCurrency === "undefined") {
  window.formatCurrency = function (amount, currency) {
    const symbols = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      NGN: "₦",
    };

    const symbol = symbols[currency] || currency;

    if (currency === "NGN") {
      return `${symbol}${amount
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
    }

    return `${symbol}${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };
}

// Get conversion rate (if not loaded from mock-data)
if (typeof getConversionRate === "undefined") {
  window.getConversionRate = function (from, to) {
    const rates = {
      USD: { EUR: 0.92, GBP: 0.79, NGN: 1650.0, USD: 1.0 },
      EUR: { USD: 1.09, GBP: 0.86, NGN: 1800.0, EUR: 1.0 },
      GBP: { USD: 1.27, EUR: 1.16, NGN: 2100.0, GBP: 1.0 },
      NGN: { USD: 0.00061, EUR: 0.00056, GBP: 0.00048, NGN: 1.0 },
    };

    if (rates[from] && rates[from][to]) {
      return rates[from][to];
    }
    return 1;
  };
}

// Calculate fee (if not loaded from mock-data)
if (typeof calculateFee === "undefined") {
  window.calculateFee = function (amount) {
    const fee = amount * 0.015;
    return Math.max(fee, 1.0);
  };
}

// Generate transaction ID (if not loaded from mock-data)
if (typeof generateTransactionId === "undefined") {
  window.generateTransactionId = function () {
    return "TXN" + Date.now() + Math.floor(Math.random() * 1000);
  };
}

// Debounce helper (if not in components.js)
if (typeof debounce === "undefined") {
  window.debounce = function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
}

// Page transition helper
function transitionToPage(url, delay = 300) {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.3s ease";

  setTimeout(() => {
    window.location.href = url;
  }, delay);
}

// Number animation helper
function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (
      (increment > 0 && current >= end) ||
      (increment < 0 && current <= end)
    ) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// Handle back button
window.addEventListener("popstate", function (e) {
  // Handle browser back button
  if (
    !localStorage.getItem("isLoggedIn") &&
    window.location.pathname.includes("dashboard")
  ) {
    window.location.href = "login.html";
  }
});

// Prevent back button to login after logout
if (
  window.location.pathname.includes("login") ||
  window.location.pathname.includes("register")
) {
  window.history.pushState(null, null, window.location.href);
  window.addEventListener("popstate", function () {
    window.history.pushState(null, null, window.location.href);
  });
}

// Initialize service worker for PWA capabilities (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Service worker registration would go here for PWA
    // navigator.serviceWorker.register('/sw.js');
  });
}

// Global error handler
window.addEventListener("error", function (e) {
  console.error("Global error:", e.error);
  // In production, you might want to send this to an error tracking service
});

// Global unhandled promise rejection handler
window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled promise rejection:", e.reason);
  // In production, you might want to send this to an error tracking service
});

// Utility: Format date relative to now
function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString();
}

// Utility: Generate random color
function generateColor(seed) {
  const colors = [
    "#667eea",
    "#764ba2",
    "#f093fb",
    "#4facfe",
    "#43e97b",
    "#fa709a",
    "#fee140",
    "#30cfd0",
  ];

  if (seed) {
    const index = seed.charCodeAt(0) % colors.length;
    return colors[index];
  }

  return colors[Math.floor(Math.random() * colors.length)];
}

// Utility: Truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Utility: Validate amount
function validateAmount(amount, minAmount = 0.01) {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount >= minAmount;
}

// Utility: Format phone number
function formatPhoneNumber(phone) {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format as international number
  if (cleaned.length === 10) {
    return `+234 ${cleaned.substring(0, 3)} ${cleaned.substring(
      3,
      6
    )} ${cleaned.substring(6)}`;
  }

  return phone;
}

// Utility: Generate avatar initials
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Export utilities for use in other scripts
window.MonieKing = {
  transitionToPage,
  animateValue,
  getRelativeTime,
  generateColor,
  truncateText,
  validateAmount,
  formatPhoneNumber,
  getInitials,
};

console.log("MonieKing App Initialized ✓");
