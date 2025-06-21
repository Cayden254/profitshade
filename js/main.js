// Extract the first available token from Deriv's OAuth redirect
const params = new URLSearchParams(window.location.search);
const possibleTokens = [params.get("token"), params.get("token1"), params.get("token2"), params.get("token3")];
const token = possibleTokens.find(t => t && t.startsWith("a1-"));  // Only pick valid token

if (token) {
  localStorage.setItem("deriv_token", token);
  // Remove tokens from URL after storing
  window.history.replaceState({}, document.title, window.location.pathname);
}

const savedToken = localStorage.getItem("deriv_token");

if (savedToken) {
  document.getElementById("tool-sections").style.display = "block";
  document.getElementById("login-required").style.display = "none";

  // Authorize using the saved token
  fetch("https://api.deriv.com/websockets/v3", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorize: savedToken })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error || !data.authorize) {
        throw new Error("Authorization failed");
      }
      const acc = data.authorize;
      document.getElementById("account-id").textContent = acc.loginid;
      document.getElementById("account-balance").textContent = `$${acc.balance.toFixed(2)}`;
      document.getElementById("account-type").textContent = acc.account_type === "virtual" ? "Demo" : "Real";
    })
    .catch(err => {
      console.error("❌ Authorization error:", err);
      alert("❌ Authorization failed. Please log in again.");
      logout();
    });
} else {
  // Not logged in
  document.getElementById("tool-sections").style.display = "none";
  document.getElementById("login-required").style.display = "block";
}

// Load bot into iframe builder
function loadBot(botUrl) {
  document.getElementById("botBuilderIframe").src = `https://app.deriv.com/bot?bot=${botUrl}`;
  showSection("botbuilder");
}

// Tab section switching
function showSection(id) {
  document.querySelectorAll(".tab-section").forEach(section => {
    section.style.display = "none";
  });
  const section = document.getElementById(id);
  if (section) section.style.display = "block";
}

// Log out user
function logout() {
  localStorage.removeItem("deriv_token");
  window.location.reload();
}

// Theme toggle system
function toggleTheme() {
  const body = document.body;
  body.classList.toggle("light-theme");
  body.classList.toggle("dark-theme");
  localStorage.setItem("theme", body.classList.contains("light-theme") ? "light" : "dark");
}

// Theme load on startup
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
  }
});
