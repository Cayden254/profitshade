// 1. Get token from URL and store it
const urlParams = new URLSearchParams(window.location.search);
const tokenFromUrl = urlParams.get("token");

if (tokenFromUrl) {
  localStorage.setItem("deriv_token", tokenFromUrl);
  // Redirect to clean URL without token
  window.location.href = window.location.origin + window.location.pathname;
}

// 2. Check token in storage
const savedToken = localStorage.getItem("deriv_token");

if (savedToken) {
  // Show tools
  document.getElementById("tool-sections").style.display = "block";
  document.getElementById("login-required").style.display = "none";
  document.getElementById("account-info").style.display = "block";

  // Fetch account info
  fetch("https://api.deriv.com/api/v1/authorize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorize: savedToken }),
  })
    .then(res => res.json())
    .then(data => {
      const account = data.authorize;
      document.getElementById("account-id").textContent = account.loginid;
      document.getElementById("account-balance").textContent = `$${account.balance.toFixed(2)}`;
      document.getElementById("account-type").textContent = account.account_type === "virtual" ? "Demo" : "Real";
    })
    .catch(() => {
      alert("Authorization failed. Please log in again.");
      logoutDeriv();
    });
} else {
  // Not logged in
  document.getElementById("tool-sections").style.display = "none";
  document.getElementById("login-required").style.display = "block";
  document.getElementById("account-info").style.display = "none";
}
// 🔐 Deriv login redirect token handler
const urlParams = new URLSearchParams(window.location.search);
const tokenFromUrl = urlParams.get("token");

if (tokenFromUrl) {
  localStorage.setItem("deriv_token", tokenFromUrl);
  window.location.href = window.location.origin + window.location.pathname;
}

const savedToken = localStorage.getItem("deriv_token");

if (savedToken) {
  document.getElementById("tool-sections").style.display = "block";
  document.getElementById("login-required").style.display = "none";
  document.getElementById("account-info").style.display = "block";

  fetch("https://api.deriv.com/api/v1/authorize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorize: savedToken }),
  })
  .then(res => res.json())
  .then(data => {
    const account = data.authorize;
    document.getElementById("account-id").textContent = account.loginid;
    document.getElementById("account-balance").textContent = `$${account.balance.toFixed(2)}`;
    document.getElementById("account-type").textContent = account.account_type === "virtual" ? "Demo" : "Real";
  })
  .catch(() => {
    alert("Authorization failed. Please log in again.");
    logoutDeriv();
  });
} else {
  document.getElementById("login-required").style.display = "block";
  document.getElementById("tool-sections").style.display = "none";
  document.getElementById("account-info").style.display = "none";
}

function logoutDeriv() {
  localStorage.removeItem("deriv_token");
  alert("You have been logged out.");
  location.reload();
}

function loadBot(botUrl) {
  const iframe = document.getElementById("botBuilderIframe");
  iframe.src = `https://app.deriv.com/bot?bot=${botUrl}`;
  document.getElementById('botbuilder').scrollIntoView({ behavior: 'smooth' });
}

function calcMartingale() {
  const capital = parseFloat(document.getElementById("capital").value) || 0;
  const initial = parseFloat(document.getElementById("initial").value) || 0;
  const levels = parseInt(document.getElementById("levels").value) || 0;
  const stakeList = document.getElementById("stakeList");
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
