// ✅ Theme Toggle System
function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("dark-theme")) {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
  }
}

// ✅ Load saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.remove("dark-theme", "light-theme");
    document.body.classList.add(savedTheme);
  }

  // ✅ Handle Deriv Token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token1") || params.get("token2") || params.get("token3");

  if (token) {
    localStorage.setItem("deriv_token", token);
    window.location.href = window.location.origin + window.location.pathname;
    return;
  }

  // ✅ Load Token from Storage
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
        if (!data.authorize) throw new Error("Invalid token");
        const acc = data.authorize;
        document.getElementById("account-id").textContent = acc.loginid;
        document.getElementById("account-balance").textContent = `$${acc.balance.toFixed(2)}`;
        document.getElementById("account-type").textContent = acc.account_type === "virtual" ? "Demo" : "Real";
      })
      .catch(() => {
        alert("❌ Authorization failed. Please log in again.");
        logoutDeriv();
      });
  } else {
    document.getElementById("tool-sections").style.display = "none";
    document.getElementById("login-required").style.display = "block";
    document.getElementById("account-info").style.display = "none";
  }
});

// ✅ Logout Function
function logoutDeriv() {
  localStorage.removeItem("deriv_token");
  location.reload();
}

// ✅ Section Switching (optional for SPA logic)
function showSection(id) {
  document.querySelectorAll(".section").forEach(section => {
    section.style.display = "none";
  });
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
  window.scrollTo(0, 0);
}
