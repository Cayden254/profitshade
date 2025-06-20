// ✅ Handle Deriv Login Token
const params = new URLSearchParams(window.location.search);
const token = params.get("token1") || params.get("token2") || params.get("token3");

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
      if (!data.authorize) throw new Error("Invalid token");
      console.log("✅ Logged in as:", data.authorize.loginid);
    })
    .catch(err => {
      alert("Failed to authorize. Please log in again.");
      logoutDeriv();
    });
} else {
  document.getElementById("tool-sections").style.display = "none";
  document.getElementById("login-required").style.display = "block";
}

// ✅ Load Bot into Deriv iframe
function loadBot(botPath) {
  const iframe = document.getElementById("botBuilderIframe");
  iframe.src = `https://app.deriv.com/bot?bot=${botPath}`;
  showSection("botbuilder");
}

// ✅ Manual section switching
function showSection(id) {
  document.querySelectorAll(".section").forEach(section => {
    section.style.display = "none";
  });
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
  window.scrollTo(0, 0);
}

// ✅ Logout
function logoutDeriv() {
  localStorage.removeItem("deriv_token");
  window.location.reload();
}
