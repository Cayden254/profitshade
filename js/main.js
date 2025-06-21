// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("light-theme");
  document.body.classList.toggle("dark-theme");
}

// Load Bot into Builder Iframe
function loadBot(botUrl) {
  const iframe = document.getElementById("botBuilderIframe");
  iframe.src = `https://app.deriv.com/bot?bot=${botUrl}`;
  const tabTrigger = new bootstrap.Tab(document.querySelector('[data-bs-target="#botbuilder"]'));
  tabTrigger.show();
  document.getElementById('botbuilder').scrollIntoView({ behavior: 'smooth' });
}

// Risk Calculator
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

// Deriv Auth Token Handling
const params = new URLSearchParams(window.location.search);
const token = params.get("token1") || params.get("token") || params.get("deriv_token");
if (token) {
  localStorage.setItem("deriv_token", token);
  window.location.href = window.location.origin + window.location.pathname;
}
const savedToken = localStorage.getItem("deriv_token");

if (savedToken) {
  fetch("https://api.deriv.com/api/v1/authorize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorize: savedToken })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("❌ Authorization failed. Please log in again.");
        logout();
        return;
      }
      const acc = data.authorize;
      document.getElementById("account-id").textContent = acc.loginid;
      document.getElementById("account-balance").textContent = `$${acc.balance.toFixed(2)}`;
      document.getElementById("account-type").textContent = acc.account_type === "virtual" ? "Demo" : "Real";

      document.getElementById("account-info").style.display = "block";
      document.getElementById("logout-btn").classList.remove("d-none");
      document.getElementById("login-btn").classList.add("d-none");
    })
    .catch(() => {
      alert("❌ Could not authorize your account. Please try again.");
      logout();
    });
} else {
  document.getElementById("account-info").style.display = "none";
  document.getElementById("logout-btn").classList.add("d-none");
  document.getElementById("login-btn").classList.remove("d-none");
}

// Logout Handler
function logout() {
  localStorage.removeItem("deriv_token");
  window.location.reload();
}
