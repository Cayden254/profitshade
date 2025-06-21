// Get valid token from any token1, token2, token3
const params = new URLSearchParams(window.location.search);
let token = params.get("token") || params.get("token1") || params.get("token2") || params.get("token3");

if (token) {
  localStorage.setItem("deriv_token", token);
  // Clean up URL
  window.history.replaceState({}, document.title, window.location.pathname);
}

const savedToken = localStorage.getItem("deriv_token");

if (savedToken) {
  // Show tools and hide login
  document.getElementById("tool-sections").style.display = "block";
  document.getElementById("login-required").style.display = "none";

  // Authorize user
  fetch("https://api.deriv.com/api/v1/authorize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorize: savedToken })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        throw new Error("Authorization failed");
      }

      const acc = data.authorize;
      document.getElementById("account-id").textContent = acc.loginid;
      document.getElementById("account-balance").textContent = `$${acc.balance.toFixed(2)}`;
      document.getElementById("account-type").textContent = acc.account_type === "virtual" ? "Demo" : "Real";
    })
    .catch(() => {
      alert("❌ Authorization failed. Please log in again.");
      logout();
    });
} else {
  document.getElementById("tool-sections").style.display = "none";
  document.getElementById("login-required").style.display = "block";
}

function loadBot(botUrl) {
  document.getElementById("botBuilderIframe").src = `https://app.deriv.com/bot?bot=${botUrl}`;
  showSection("botbuilder");
}

function showSection(id) {
  document.querySelectorAll(".tab-section").forEach(section => {
    section.style.display = "none";
  });
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
  window.scrollTo(0, 0);
}

function logout() {
  localStorage.removeItem("deriv_token");
  window.location.reload();
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("light-theme");
  body.classList.toggle("dark-theme");
  localStorage.setItem("theme", body.classList.contains("light-theme") ? "light" : "dark");
}

// Load saved theme
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
  }
});
