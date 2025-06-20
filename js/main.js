// Extract token from URL and store
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (token) {
  localStorage.setItem("deriv_token", token);
  window.location.href = window.location.origin + window.location.pathname;
}

const savedToken = localStorage.getItem("deriv_token");

if (savedToken) {
  // Create WebSocket connection to Deriv API
  const ws = new WebSocket("wss://ws.derivws.com/websockets/v3");

  ws.onopen = () => {
    ws.send(JSON.stringify({ authorize: savedToken }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.error) {
      alert("Authorization failed. Please log in again.");
      logoutDeriv();
      return;
    }

    if (data.msg_type === "authorize") {
      // ✅ Logged in
      document.getElementById("login-required").style.display = "none";
      document.getElementById("tool-sections").style.display = "block";

      console.log("✅ Logged in as:", data.authorize.loginid);
    }
  };

  ws.onerror = () => {
    alert("WebSocket error occurred.");
  };
} else {
  document.getElementById("login-required").style.display = "block";
  document.getElementById("tool-sections").style.display = "none";
}

function logoutDeriv() {
  localStorage.removeItem("deriv_token");
  window.location.reload();
}

function loadBot(botPath) {
  const iframe = document.getElementById("botBuilderIframe");
  iframe.src = `https://app.deriv.com/bot?bot=${botPath}`;
  showSection("botbuilder");
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(section => {
    section.style.display = "none";
  });
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
  window.scrollTo(0, 0);
}
