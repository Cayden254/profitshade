const app_id = 82139;
const redirect_uri = "https://profitshade.vercel.app";

document.getElementById("login-btn").href = `https://oauth.deriv.com/oauth2/authorize?app_id=${app_id}&redirect_uri=${redirect_uri}`;

// Parse token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token1") || urlParams.get("token");

if (token) {
  localStorage.setItem("deriv_token", token);
  window.location.href = window.location.origin;
}

// Try WebSocket authorize
const savedToken = localStorage.getItem("deriv_token");

if (savedToken) {
  const ws = new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=" + app_id);
  ws.onopen = () => {
    ws.send(JSON.stringify({ authorize: savedToken }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.msg_type === "authorize") {
      document.getElementById("login-btn").classList.add("d-none");
      document.getElementById("logout-btn").classList.remove("d-none");
      document.getElementById("account-info").classList.remove("d-none");

      document.getElementById("account-id").textContent = data.authorize.loginid;
      document.getElementById("account-balance").textContent = "$" + data.authorize.balance.toFixed(2);
      document.getElementById("account-type").textContent = data.authorize.account_type === "virtual" ? "Demo" : "Real";
    } else if (data.error) {
      alert("❌ Authorization failed. Please log in again.");
      logout();
    }
  };
} else {
  document.getElementById("logout-btn").classList.add("d-none");
  document.getElementById("account-info").classList.add("d-none");
}

function logout() {
  localStorage.removeItem("deriv_token");
  window.location.reload();
}

function loadBot(botUrl) {
  const iframe = document.getElementById("botBuilderIframe");
  iframe.src = `https://app.deriv.com/bot?bot=${botUrl}`;
  const tab = new bootstrap.Tab(document.querySelector('[data-bs-target="#botbuilder"]'));
  tab.show();
}

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

function toggleTheme() {
  document.body.classList.toggle("light-theme");
}
