// Deriv Login via WebSocket
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const accountInfo = document.getElementById('account-info');

const tokenParam = new URLSearchParams(window.location.search).get('token');
if (tokenParam) {
  localStorage.setItem('deriv_token', tokenParam);
  window.location.href = window.location.origin + window.location.pathname;
}

const token = localStorage.getItem('deriv_token');
let socket;

if (token) {
  authorizeUser(token);
} else {
  showLogin();
}

function authorizeUser(token) {
  socket = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=82139');

  socket.onopen = () => {
    socket.send(JSON.stringify({ authorize: token }));
  };

  socket.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.error) {
      alert("❌ Authorization failed. Please log in again.");
      logout();
      return;
    }

    if (data.msg_type === 'authorize') {
      document.getElementById('account-id').textContent = data.authorize.loginid;
      document.getElementById('account-balance').textContent = `$${data.authorize.balance.toFixed(2)}`;
      document.getElementById('account-type-btn').textContent = data.authorize.account_type === 'virtual' ? 'Demo' : 'Real';
      accountInfo.classList.remove('d-none');
      logoutBtn.classList.remove('d-none');
      loginBtn.classList.add('d-none');
    }
  };
}

function logout() {
  localStorage.removeItem('deriv_token');
  location.reload();
}

loginBtn.onclick = () => {
  window.location.href = "https://oauth.deriv.com/oauth2/authorize?app_id=82139&redirect_uri=https://profitshade.vercel.app";
};

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
}

function switchAccountType(type) {
  if (!token) return alert('Login first.');
  socket.send(JSON.stringify({ authorize: token }));
  alert(`Switched to ${type.toUpperCase()} account`);
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

// Load Bot
function loadBot(botUrl) {
  const iframe = document.getElementById("botBuilderIframe");
  if (iframe) {
    iframe.src = `https://app.deriv.com/bot?bot=${botUrl}`;
  }
  const tabTrigger = new bootstrap.Tab(document.querySelector('[data-bs-target="#botbuilder"]'));
  tabTrigger.show();
}
