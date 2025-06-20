// ✅ Handle login token
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (token) {
  localStorage.setItem("deriv_token", token);
  window.location.href = window.location.origin + window.location.pathname;
}

const savedToken = localStorage.getItem("deriv_token");

if (savedToken) {
  fetch(`https://oauth.deriv.com/api/authorize?token=${savedToken}`)
    .then(res => res.json())
    .then(data => {
      if (!data.authorize) throw new Error("Invalid token");

      document.getElementById("tool-sections").style.display = "block";
      document.getElementById("login-required").style.display = "none";

      console.log("✅ Logged in as:", data.authorize.loginid);
    })
    .catch(err => {
      console.error("Auth failed:", err);
      logoutDeriv();
    });
} else {
  document.getElementById("tool-sections").style.display = "none";
  document.getElementById("login-required").style.display = "block";
}

// ✅ Load bot to builder
function loadBot(botPath) {
  const iframe = document.getElementById("botBuilderIframe");
  iframe.src = `https://app.deriv.com/bot?bot=${botPath}`;
  showSection("botbuilder");
}

// ✅ Switch section
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
