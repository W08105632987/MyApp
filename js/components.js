// Reusable UI Components for MonieKing

// Modal Component
function showModal(title, content, buttons = []) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  const header = document.createElement("div");
  header.className = "modal-header";
  header.innerHTML = `<h2 class="modal-title">${title}</h2>`;

  const body = document.createElement("div");
  body.className = "modal-body";
  body.innerHTML = content;

  const footer = document.createElement("div");
  footer.className = "modal-footer";

  buttons.forEach((btn) => {
    const button = document.createElement("button");
    button.className = btn.class || "btn btn-primary";
    button.textContent = btn.text;
    button.onclick = () => {
      if (btn.onClick) btn.onClick();
      closeModal();
    };
    footer.appendChild(button);
  });

  modal.appendChild(header);
  modal.appendChild(body);
  if (buttons.length > 0) modal.appendChild(footer);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape key
  document.addEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(e) {
  if (e.key === "Escape") closeModal();
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.remove();
    document.removeEventListener("keydown", handleEscapeKey);
  }
}

// Success Modal
function showSuccessModal(title, message, onClose) {
  const content = `
    <div class="text-center">
      <div style="font-size: 4rem; color: var(--success); margin-bottom: 1rem;">✓</div>
      <p style="font-size: 1.125rem; color: var(--text-dark);">${message}</p>
    </div>
  `;

  showModal(title, content, [
    { text: "Done", class: "btn btn-primary", onClick: onClose },
  ]);
}

// Error Modal
function showErrorModal(title, message) {
  const content = `
    <div class="text-center">
      <div style="font-size: 4rem; color: var(--error); margin-bottom: 1rem;">✕</div>
      <p style="font-size: 1.125rem; color: var(--text-dark);">${message}</p>
    </div>
  `;

  showModal(title, content, [{ text: "Close", class: "btn btn-outline" }]);
}

// Loading Spinner
function showLoader() {
  const loader = document.createElement("div");
  loader.id = "global-loader";
  loader.className = "modal-overlay";
  loader.innerHTML = `
    <div style="text-align: center;">
      <div class="spinner spinner-lg"></div>
      <p style="color: white; margin-top: 1rem; font-weight: 600;">Processing...</p>
    </div>
  `;
  document.body.appendChild(loader);
}

function hideLoader() {
  const loader = document.getElementById("global-loader");
  if (loader) loader.remove();
}

// Alert Component
function showAlert(message, type = "info") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} fade-in`;
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "20px";
  alertDiv.style.left = "50%";
  alertDiv.style.transform = "translateX(-50%)";
  alertDiv.style.zIndex = "3000";
  alertDiv.style.minWidth = "300px";
  alertDiv.style.maxWidth = "90%";

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  alertDiv.innerHTML = `
    <span style="font-size: 1.25rem; font-weight: bold;">${icons[type]}</span>
    <span>${message}</span>
  `;

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.style.opacity = "0";
    alertDiv.style.transform = "translateX(-50%) translateY(-20px)";
    setTimeout(() => alertDiv.remove(), 300);
  }, 3000);
}

// Transaction Item Component
function createTransactionItem(transaction) {
  const isPositive = transaction.type === "Receive";
  const sign = isPositive ? "+" : "-";

  return `
    <div class="transaction-item" onclick="showTransactionDetails(${
      transaction.id
    })">
      <div style="display: flex; align-items: center; flex: 1;">
        <div class="transaction-icon ${transaction.type.toLowerCase()}">
          ${getTransactionIcon(transaction.type)}
        </div>
        <div class="transaction-details">
          <div class="transaction-type">${transaction.type}</div>
          <div class="transaction-date">${formatDate(transaction.date)}</div>
        </div>
      </div>
      <div class="transaction-amount">
        <div class="transaction-value ${isPositive ? "positive" : "negative"}">
          ${sign}${formatCurrency(transaction.amount, transaction.currency)}
        </div>
        <span class="transaction-status ${transaction.status.toLowerCase()}">${
    transaction.status
  }</span>
      </div>
    </div>
  `;
}

// Wallet Card Component
function createWalletCard(wallet) {
  return `
    <div class="wallet-item">
      <div class="wallet-currency">${wallet.currency}</div>
      <div class="wallet-balance">${formatCurrency(
        wallet.balance,
        wallet.currency
      )}</div>
    </div>
  `;
}

// Product Card Component
function createProductCard(product) {
  return `
    <div class="product-card" onclick="showProductDetails(${product.id})">
      <div class="product-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: bold;">
        ${product.brand.charAt(0)}
      </div>
      <div class="product-info">
        <div class="product-brand">${product.brand}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">${formatCurrency(
          product.price,
          product.currency
        )}</div>
        <button class="btn btn-primary btn-sm w-full" onclick="event.stopPropagation(); addToCart(${
          product.id
        })">
          Buy Now
        </button>
      </div>
    </div>
  `;
}

// Bottom Navigation
function createBottomNav(activePage) {
  const pages = [
    { id: "dashboard", icon: "🏠", label: "Home", file: "dashboard.html" },
    {
      id: "transactions",
      icon: "📊",
      label: "Transactions",
      file: "transactions.html",
    },
    { id: "shop", icon: "🛍️", label: "Shop", file: "shop.html" },
    { id: "settings", icon: "⚙️", label: "Settings", file: "settings.html" },
  ];

  return `
    <nav class="bottom-nav">
      ${pages
        .map(
          (page) => `
        <a href="${page.file}" class="nav-item ${
            activePage === page.id ? "active" : ""
          }">
          <div class="nav-icon">${page.icon}</div>
          <div class="nav-label">${page.label}</div>
        </a>
      `
        )
        .join("")}
    </nav>
  `;
}

// QR Code Generator (Simple text-based)
function generateQRCode(text) {
  // This is a placeholder - in production, use a library like qrcode.js
  return `
    <div style="width: 200px; height: 200px; background: white; border: 2px solid #E2E8F0; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 3rem; margin-bottom: 10px;">📱</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); word-break: break-all;">${text.substring(
          0,
          30
        )}...</div>
      </div>
    </div>
  `;
}

// Copy to Clipboard
function copyToClipboard(text, successMessage = "Copied to clipboard!") {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showAlert(successMessage, "success");
      })
      .catch((err) => {
        // Fallback method
        fallbackCopy(text, successMessage);
      });
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand("copy");
    showAlert(successMessage, "success");
  } catch (err) {
    showAlert("Failed to copy", "error");
  }

  document.body.removeChild(textArea);
}

// Format Date Helper
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Currency Formatter (using helper from mock-data)
function formatCurrency(amount, currency) {
  const symbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    NGN: "₦",
  };

  const symbol = symbols[currency] || currency;

  if (currency === "NGN") {
    return `${symbol}${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  }

  return `${symbol}${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
}

// Transaction Icon Helper
function getTransactionIcon(type) {
  const icons = {
    Send: "↑",
    Receive: "↓",
    Convert: "↔",
  };
  return icons[type] || "•";
}

// Validate Email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate Phone
function validatePhone(phone) {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone.replace(/\s/g, ""));
}

// Form Validation Helper
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;

  const inputs = form.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "var(--error)";
      isValid = false;
    } else {
      input.style.borderColor = "#E2E8F0";
    }

    // Special validation for email
    if (input.type === "email" && input.value && !validateEmail(input.value)) {
      input.style.borderColor = "var(--error)";
      isValid = false;
    }
  });

  return isValid;
}

// Smooth Scroll to Element
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Debounce Helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
