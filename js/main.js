// === THEME TOGGLE ===
function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("light-theme")) {
    body.classList.replace("light-theme", "dark-theme");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.replace("dark-theme", "light-theme");
    localStorage.setItem("theme", "light");
  }
}
window.onload = () => {
  const theme = localStorage.getItem("theme") || "light";
  document.body.classList.add(`${theme}-theme`);
};

// === STATE ===
let ws = null;
let selected_account = null;
let all_accounts = {};
const app_id = 82139;

// === LOGIN BUTTON ===
document.getElementById("login-btn").onclick = () => {
  window.location.href = `https://oauth.deriv.com/oauth2/authorize?app_id=${app_id}&redirect_uri=${window.location.origin}`;
};

// === LOGOUT ===
function logout() {
  localStorage.removeItem("deriv_token");
  location.reload();
}

// === HANDLE TOKEN IN URL ===
const url = new URLSearchParams(window.location.search);
const token_from_url = url.get("token1") || url.get("token2") || url.get("token3");
if (token_from_url) {
  localStorage.setItem("deriv_token", token_from_url);
  window.location.href = window.location.origin;
}

const token = localStorage.getItem("deriv_token");
if (token) {
  initWebSocket(token);
} else {
  showLoginUI();
}

function initWebSocket(token) {
  ws = new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=" + app_id);

  ws.onopen = () => {
    ws.send(JSON.stringify({ authorize: token }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.error) {
      alert("❌ Authorization failed. Please log in again.");
      logout();
      return;
    }

    if (data.msg_type === "authorize") {
      all_accounts = data.authorize.accounts;
      selected_account = data.authorize.loginid;

      updateUI(data.authorize);
      document.getElementById("tool-sections").style.display = "block";
      document.getElementById("login-btn").style.display = "none";
      document.getElementById("logout-btn").classList.remove("d-none");
    }

    if (data.msg_type === "balance") {
      document.getElementById("account-balance").textContent = `$${data.balance.balance.toFixed(2)}`;
    }
  };
}

// === UPDATE UI ON AUTH ===
function updateUI(account) {
  document.getElementById("account-info").classList.remove("d-none");
  document.getElementById("account-id").textContent = account.loginid;
  document.getElementById("account-type").textContent =
    account.is_virtual ? "Demo" : "Real";

  requestBalance();
  populateAccountSelector();
}

function requestBalance() {
  ws.send(JSON.stringify({ balance: 1, subscribe: 1 }));
}

// === ACCOUNT SELECTOR ===
function populateAccountSelector() {
  const dropdown = document.getElementById("account-type");
  if (!dropdown.classList.contains("dropdown-toggle")) {
    dropdown.classList.add("dropdown-toggle");
    dropdown.setAttribute("data-bs-toggle", "dropdown");
    const menu = document.createElement("ul");
    menu.className = "dropdown-menu";

    all_accounts.forEach((acct) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "dropdown-item";
      a.textContent = `${acct.loginid} (${acct.is_virtual ? "Demo" : "Real"})`;
      a.onclick = () => switchAccount(acct.loginid, acct.token);
      li.appendChild(a);
      menu.appendChild(li);
    });

    dropdown.parentElement.appendChild(menu);
  }
}

function switchAccount(loginid, token) {
  localStorage.setItem("deriv_token", token);
  window.location.reload();
}

// === BOT LOADER ===
function loadBot(botPath) {
  const iframe = document.getElementById("botBuilderIframe");
  iframe.src = `https://app.deriv.com/bot?bot=${botPath}`;
  const tabTrigger = new bootstrap.Tab(document.querySelector('[data-bs-target="#botbuilder"]'));
  tabTrigger.show();
}

// === RISK CALCULATOR ===
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

// === TOGGLE TOOL VISIBILITY ===
function showLoginUI() {
  document.getElementById("tool-sections").style.display = "none";
  document.getElementById("login-btn").style.display = "inline-block";
  document.getElementById("logout-btn").classList.add("d-none");
}
