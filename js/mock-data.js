// Mock Data for MonieKing App

const user = {
  name: "Wisdom Okechukwu",
  email: "wisdom@monieking.com",
  phone: "+234 803 456 7890",
  totalBalanceUSD: 2650.75,
  kycStatus: "verified", // verified, pending, rejected
  profileImage: "",
  wallets: [
    { currency: "USD", balance: 1250.0, symbol: "$" },
    { currency: "EUR", balance: 640.0, symbol: "€" },
    { currency: "GBP", balance: 320.5, symbol: "£" },
    { currency: "NGN", balance: 580000, symbol: "₦" },
  ],
  transactions: [
    {
      id: 1,
      type: "Send",
      amount: 200,
      currency: "USD",
      date: "2025-11-09",
      status: "Completed",
      recipient: "John Doe",
      description: "Payment for services",
    },
    {
      id: 2,
      type: "Receive",
      amount: 150,
      currency: "EUR",
      date: "2025-11-08",
      status: "Completed",
      sender: "Sarah Smith",
      description: "Freelance payment",
    },
    {
      id: 3,
      type: "Convert",
      amount: 50,
      currency: "USD",
      date: "2025-11-07",
      status: "Pending",
      from: "USD",
      to: "EUR",
      description: "Currency conversion",
    },
    {
      id: 4,
      type: "Send",
      amount: 75,
      currency: "GBP",
      date: "2025-11-06",
      status: "Completed",
      recipient: "Michael Brown",
      description: "Gift",
    },
    {
      id: 5,
      type: "Receive",
      amount: 300,
      currency: "USD",
      date: "2025-11-05",
      status: "Completed",
      sender: "Tech Corp Ltd",
      description: "Monthly salary",
    },
    {
      id: 6,
      type: "Convert",
      amount: 100,
      currency: "EUR",
      date: "2025-11-04",
      status: "Completed",
      from: "EUR",
      to: "USD",
      description: "Currency conversion",
    },
    {
      id: 7,
      type: "Send",
      amount: 500,
      currency: "USD",
      date: "2025-11-03",
      status: "Failed",
      recipient: "Jane Wilson",
      description: "Failed transaction",
    },
  ],
};

const exchangeRates = {
  USD: {
    EUR: 0.92,
    GBP: 0.79,
    NGN: 1650.0,
    USD: 1.0,
  },
  EUR: {
    USD: 1.09,
    GBP: 0.86,
    NGN: 1800.0,
    EUR: 1.0,
  },
  GBP: {
    USD: 1.27,
    EUR: 1.16,
    NGN: 2100.0,
    GBP: 1.0,
  },
  NGN: {
    USD: 0.00061,
    EUR: 0.00056,
    GBP: 0.00048,
    NGN: 1.0,
  },
};

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    brand: "Apple",
    price: 999.0,
    currency: "USD",
    image: "",
    category: "Electronics",
    inStock: true,
  },
  {
    id: 2,
    name: "AirPods Pro",
    brand: "Apple",
    price: 249.0,
    currency: "USD",
    image: "",
    category: "Audio",
    inStock: true,
  },
  {
    id: 3,
    name: "MacBook Air M2",
    brand: "Apple",
    price: 1199.0,
    currency: "USD",
    image: "",
    category: "Computers",
    inStock: true,
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    price: 899.0,
    currency: "USD",
    image: "",
    category: "Electronics",
    inStock: true,
  },
  {
    id: 5,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    price: 399.0,
    currency: "USD",
    image: "",
    category: "Audio",
    inStock: false,
  },
  {
    id: 6,
    name: "iPad Pro 12.9",
    brand: "Apple",
    price: 1099.0,
    currency: "USD",
    image: "",
    category: "Tablets",
    inStock: true,
  },
  {
    id: 7,
    name: "Dell XPS 15",
    brand: "Dell",
    price: 1499.0,
    currency: "USD",
    image: "",
    category: "Computers",
    inStock: true,
  },
  {
    id: 8,
    name: "Nintendo Switch",
    brand: "Nintendo",
    price: 299.0,
    currency: "USD",
    image: "",
    category: "Gaming",
    inStock: true,
  },
];

const countries = [
  { name: "United States", code: "US", currency: "USD" },
  { name: "United Kingdom", code: "GB", currency: "GBP" },
  { name: "Germany", code: "DE", currency: "EUR" },
  { name: "France", code: "FR", currency: "EUR" },
  { name: "Nigeria", code: "NG", currency: "NGN" },
  { name: "Canada", code: "CA", currency: "CAD" },
  { name: "Australia", code: "AU", currency: "AUD" },
  { name: "Japan", code: "JP", currency: "JPY" },
];

const banks = [
  "Chase Bank",
  "Bank of America",
  "Wells Fargo",
  "Citibank",
  "HSBC",
  "Barclays",
  "Deutsche Bank",
  "BNP Paribas",
  "Access Bank",
  "GTBank",
  "First Bank",
  "Zenith Bank",
];

// Helper Functions
function getConversionRate(from, to) {
  if (exchangeRates[from] && exchangeRates[from][to]) {
    return exchangeRates[from][to];
  }
  return 1;
}

function calculateFee(amount) {
  // 1.5% fee, minimum $1
  const fee = amount * 0.015;
  return Math.max(fee, 1.0);
}

function generateTransactionId() {
  return "TXN" + Date.now() + Math.floor(Math.random() * 1000);
}

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

function getStatusColor(status) {
  const colors = {
    Completed: "success",
    Pending: "warning",
    Failed: "error",
  };
  return colors[status] || "default";
}

function getTransactionIcon(type) {
  const icons = {
    Send: "↑",
    Receive: "↓",
    Convert: "↔",
  };
  return icons[type] || "•";
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    user,
    exchangeRates,
    products,
    countries,
    banks,
    getConversionRate,
    calculateFee,
    generateTransactionId,
    formatCurrency,
    getStatusColor,
    getTransactionIcon,
  };
}
