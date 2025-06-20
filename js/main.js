// Handle Deriv Login Token
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
  document.getElementById("account-info").style.display = "block";

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
      alert("Failed to authorize. Please log in again.");
      logoutDeriv();
    });
} else {
  document.getElementById("tool-sections").style.display = "none";
  document.getElementById("login-required").style.display = "block";
  document.getElementById("account-info").style.display = "none";
}

function logoutDeriv() {
  localStorage.removeItem("deriv_token");
  window.location.reload();
}

// Optional: section switching
function showSection(id) {
  document.querySelectorAll(".section").forEach(section => {
    section.style.display = "none";
  });
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
  window.scrollTo(0, 0);
}
console.log("Token:", token);
console.log("Saved token:", savedToken);

