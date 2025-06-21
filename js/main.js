// main.js - ProfitShade Core Script

const app_id = 82139;
const redirect_uri = "https://profitshade.vercel.app";
const deriv_login_url = `https://oauth.deriv.com/oauth2/authorize?app_id=${app_id}&redirect_uri=${redirect_uri}`;

// Theme Toggle
const toggleTheme = () => {
  const current = document.body.getAttribute("data-theme") || "light";
  const newTheme = current === "light" ? "dark" : "light";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
};

// Apply Saved Theme
const savedTheme = localStorage.getItem("theme") || "light";
document.body.setAttribute("data-theme", savedTheme);

// Elements
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const accountInfo = document.getElementById("account-info");
const accountId = document.getElementById("account-id");
const accountBalance = document.getElementById("account-balance");
const accountType = document.getElementById("account-type");
const botIframe = document.getElementById("botBuilderIframe");

// Load Bot
function loadBot(botUrl) {
  const token = localStorage.getItem("deriv_token");
  if (!token) {
    alert("🔐 Please login first to load bots.");
    return;
  }
 // Handles contract type buttons and prediction display
function renderContractOptions() {
  const strategy = document.getElementById("strategy").value;
  const predictionGroup = document.getElementById("prediction-group");
  const contractOptions = document.getElementById("contract-options");
  contractOptions.innerHTML = "";

  const strategies = {
    evenodd: ["Even", "Odd"],
    overunder: ["Over", "Under"],
    matchesdiffers: ["Matches", "Differs"],
    risefall: ["Rise", "Fall"]
  };

  const needsPrediction = strategy === "overunder" || strategy === "matchesdiffers";
  predictionGroup.style.display = needsPrediction ? "block" : "none";

  for (let type of strategies[strategy]) {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary";
    btn.textContent = type;
    btn.onclick = () => {
      document.querySelectorAll("#contract-options button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      btn.setAttribute("data-selected", "true");
    };
    contractOptions.appendChild(btn);
  }
}

// Martingale section toggle
document.getElementById("martingaleCheck").addEventListener("change", (e) => {
  document.getElementById("martingale-settings").style.display = e.target.checked ? "block" : "none";
});

// Placeholder bot functions
function startBot() {
  alert("✅ Bot started with selected config.");
}

function pauseBot() {
  alert("⏸️ Bot paused.");
}

function resumeBot() {
  alert("▶️ Bot resumed.");
}

function stopBot() {
  alert("🛑 Bot stopped.");
}

  document.querySelector('[data-bs-target="#botbuilder"]').click();
  document.getElementById("botbuilder").scrollIntoView({ behavior: "smooth" });
}

// Martingale Calculator
function calcMartingale() {
  const capital = parseFloat(document.getElementById("capital").value) || 0;
  const initial = parseFloat(document.getElementById("initial").value) || 0;
  const levels = parseInt(document.getElementById("levels").value) || 0;
  let stakeList = document.getElementById("stakeList");
  stakeList.innerHTML = "";
  let totalRisk = 0;
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

// Handle login token
const params = new URLSearchParams(window.location.search);
const token = params.get("token1") || params.get("token");

if (token) {
  localStorage.setItem("deriv_token", token);
  window.location.href = window.location.origin + window.location.pathname;
} else {
  const savedToken = localStorage.getItem("deriv_token");
  if (savedToken) {
    const ws = new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=" + app_id);
    ws.onopen = () => {
      ws.send(JSON.stringify({ authorize: savedToken }));
    };
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.msg_type === "authorize") {
        accountId.textContent = data.authorize.loginid;
        accountBalance.textContent = `$${data.authorize.balance.toFixed(2)}`;
        accountType.textContent = data.authorize.is_virtual ? "Demo" : "Real";
        accountInfo.classList.remove("d-none");
        loginBtn.classList.add("d-none");
        logoutBtn.classList.remove("d-none");
      } else if (data.error) {
        alert("❌ Authorization failed. Please login again.");
        logout();
      }
    };
  }
}

// Logout
function logout() {
  localStorage.removeItem("deriv_token");
  window.location.href = window.location.origin;
}

// Login Button Redirect
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    window.location.href = deriv_login_url;
  });
}
