const ws = new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=82139");

// Get token from URL
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (token) {
  localStorage.setItem("deriv_token", token);
  window.history.replaceState({}, document.title, window.location.pathname);
}

const savedToken = localStorage.getItem("deriv_token");

// Show login/signup if no token
if (!savedToken) {
  document.getElementById("login-required").style.display = "block";
  document.getElementById("tool-sections").style.display = "none";
  document.getElementById("account-info").style.display = "none";
} else {
  document.getElementById("login-required").style.display = "none";
  document.getElementById("tool-sections").style.display = "block";
  document.getElementById("account-info").style.display = "block";
}

// WebSocket open and send authorization
ws.addEventListener("open", () => {
  if (savedToken) {
    ws.send(JSON.stringify({ authorize: savedToken }));
  }
});

// Handle WebSocket messages
ws.addEventListener("message", function (event) {
  const response = JSON.parse(event.data);

  if (response.msg_type === "authorize") {
    const acc = response.authorize;
    document.getElementById("account-id").textContent = acc.loginid;
    document.getElementById("account-balance").textContent = `$${acc.balance.toFixed(2)}`;
    document.getElementById("account-type").textContent = acc.account_type === "virtual" ? "Demo" : "Real";
  }

  if (response.error) {
    alert("❌ Could not authorize your account. Please log in again.");
    logout();
  }
});

// Logout function
function logout() {
  localStorage.removeItem("deriv_token");
  location.reload();
}

// Optional: Theme toggle function (if included in UI)
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}
