// ✅ Get token from Deriv URL (token1, token2, token3)
const params = new URLSearchParams(window.location.search);
const token =
  params.get("token2") || // prefer real account
  params.get("token1") ||
  params.get("token3");

// ✅ Save token to localStorage and clean URL
if (token) {
  localStorage.setItem("deriv_token", token);
  window.location.href = window.location.origin + window.location.pathname;
}

// ✅ Check saved token and show tools
const savedToken = localStorage.getItem("deriv_token");

if (savedToken) {
  // Show tools, hide login
  document.getElementById("tool-sections").style.display = "block";
  document.getElementById("login-required").style.display = "none";
  document.getElementById("account-info").style.display = "block";

  // Authorize using Deriv API
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
      alert("❌ Failed to authorize. Please log in again.");
      logoutDeriv();
    });
} else {
  // Show login panel only
  document.getElementById("tool-sections").style.display = "none";
  document.getElementById("login-required").style.display = "block";
  document.getElementById("account-info").style.display = "none";
}

// ✅ Logout button clears token
function logoutDeriv() {
  localStorage.removeItem("deriv_token");
  window.location.reload();
}

// ✅ Optional: section switching logic
function showSection(id) {
  document.querySelectorAll(".section").forEach(section => {
    section.style.display = "none";
  });
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
  window.scrollTo(0, 0);
}

// ✅ Debug logs
console.log("URL Token:", token);
console.log("Saved Token:", savedToken);
