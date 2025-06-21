// Theme Toggle
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
}

// Deriv Login System
const params = new URLSearchParams(window.location.search);
const token = params.get("token1");
if (token) {
  localStorage.setItem("deriv_token", token);
  window.location.href = window.location.origin + window.location.pathname;
}

const savedToken = localStorage.getItem("deriv_token");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const accountInfo = document.getElementById("account-info");
const toolSections = document.querySelector(".tab-content");

if (savedToken) {
  loginBtn.classList.add("d-none");
  logoutBtn.classList.remove("d-none");
  accountInfo.classList.remove("d-none");

  const ws = new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=82139");
  ws.onopen = () => {
    ws.send(JSON.stringify({ authorize: savedToken }));
  };
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.error) {
      alert("❌ Could not authorize your account. Please log in again.");
      logout();
      return;
    }

    if (data.msg_type === "authorize") {
      const acc = data.authorize;
      document.getElementById("account-id").textContent = acc.loginid;
      document.getElementById("account-balance").textContent = `$${acc.balance.toFixed(2)}`;
      document.getElementById("account-type").textContent = acc.is_virtual ? "Demo" : "Real";
    }
  };
  ws.onerror = () => {
    alert("WebSocket error. Try again.");
  };
}

// Logout
function logout() {
  localStorage.removeItem("deriv_token");
  window.location.reload();
}

// Bot Loader
function loadBot(botUrl) {
  const iframe = document.getElementById("botBuilderIframe");
  iframe.src = `https://app.deriv.com/bot?bot=${botUrl}`;
  const tab = new bootstrap.Tab(document.querySelector('[data-bs-target="#botbuilder"]'));
  tab.show();
}

// Risk Calculator
function calcMartingale() {
  const capital = parseFloat(document.getElementById("capital").value) || 0;
  const initial = parseFloat(document.getElementById("initial").value) || 0;
  const levels = parseInt(document.getElementById("levels").value) || 0;
  const stakeList = document.getElementById("stakeList");
  let totalRisk = 0;
  stakeList.innerHTML = "";

  for (let i = 0; i < levels; i++) {
    const stake = initial * Math.pow(2, i);
    totalRisk += stake;
    const li = document.createElement("li");
    li.textContent = `Level ${i + 1}: $${stake.toFixed(2)}`;
    stakeList.appendChild(li);
  }

  const remaining = capital - totalRisk;
  document.getElementById("totalRisk").textContent = `$${totalRisk.toFixed(2)}`;
  document.getElementById("remaining").textContent = `$${remaining.toFixed(2)}`;
}
