// Handle Deriv OAuth Login
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (token) {
  localStorage.setItem("deriv_token", token);
  window.location.href = window.location.origin + window.location.pathname;
}

const savedToken = localStorage.getItem("deriv_token");

if (savedToken) {
  document.getElementById("tool-sections").style.display = "block";
  document.getElementById("login-required").style.display = "none";

  fetch("https://api.deriv.com/api/v1/authorize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ authorize: savedToken })
  })
    .then(res => res.json())
    .then(data => {
      const acc = data.authorize;
      document.getElementById("account-id").textContent = acc.loginid;
      document.getElementById("account-balance").textContent = `$${acc.balance.toFixed(2)}`;
      document.getElementById("account-type").textContent = acc.account_type === "virtual" ? "Demo" : "Real";
    })
    .catch(() => {
      alert("Session expired. Please log in again.");
      logout();
    });
}

function loadBot(xmlPath) {
  document.getElementById("botBuilderIframe").src = `https://app.deriv.com/bot?bot=${xmlPath}`;
  document.getElementById("botbuilder").scrollIntoView({ behavior: "smooth" });
}

function logout() {
  localStorage.removeItem("deriv_token");
  window.location.reload();
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}
