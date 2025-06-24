// main.js - ProfitShade Trading Logic (Even/Odd + Over/Under)

const app_id = 82139;
let ws;
let active_tab = null;
let auth_token = null;
let account_type = "";

const connectionStatus = document.getElementById("connection-status");
const linkBtn = document.getElementById("link-deriv");
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

// Handle WebSocket authorization
linkBtn.addEventListener("click", () => {
  const token = prompt("Paste your Deriv token");
  if (!token) return;
  auth_token = token;
  ws = new WebSocket("wss://ws.deriv.com/websockets/v3?app_id=" + app_id);

  ws.onopen = () => {
    ws.send(JSON.stringify({ authorize: token }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.msg_type === "authorize") {
      connectionStatus.textContent = `✅ Connected as ${data.authorize.loginid}`;
      account_type = data.authorize.loginid.includes("VRTC") ? "demo" : "real";
    }
  };
});

// Handle tab switching
function switchTab(tabId) {
  tabContents.forEach((tab) => tab.classList.add("hidden"));
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  document.getElementById(tabId).classList.remove("hidden");
  document.querySelector(`.tab-button[data-tab='${tabId}']`).classList.add("active");
  active_tab = tabId;
}

// Setup all tabs
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-tab");
    switchTab(target);
    if (target === "even-odd") renderEvenOdd();
    if (target === "over-under") renderOverUnder();
  });
});

// Render Even/Odd panel
function renderEvenOdd() {
  const panel = document.getElementById("even-odd");
  panel.innerHTML = `
    <div class="strategy-wrapper">
      <div class="analysis-section">
        <h2>Even/Odd Analysis</h2>
        <canvas id="evenOddChart" height="150"></canvas>
        <p>Live bars and circle analysis goes here...</p>
      </div>
      <div class="execution-section">
        <h2>Trade Execution</h2>
        <label>Volatility:
          <select id="volatility-eo">
            <option value="R_10">Volatility 10 (1s)</option>
            <option value="R_25">Volatility 25 (1s)</option>
            <option value="R_50">Volatility 50 (1s)</option>
            <option value="R_100">Volatility 100 (1s)</option>
          </select>
        </label>
        <label>Stake: <input type="number" id="stake-eo" value="0.35" /></label>
        <label>Martingale Factor: <input type="number" id="multi-eo" value="2" /></label>
        <label>Prediction Ticks: <input type="number" id="ticks-eo" value="1" /></label>
        <div class="button-group">
          <button id="evenBtn">Even</button>
          <button id="oddBtn">Odd</button>
        </div>
        <div class="status">Results and logs appear here.</div>
      </div>
    </div>
  `;
}

// Render Over/Under panel
function renderOverUnder() {
  const panel = document.getElementById("over-under");
  panel.innerHTML = `
    <div class="strategy-wrapper">
      <div class="analysis-section">
        <h2>Over/Under Analysis</h2>
        <p>Live bars and deriv-style digit circles</p>
      </div>
      <div class="execution-section">
        <h2>Trade Execution</h2>
        <label>Volatility:
          <select id="volatility-ou">
            <option value="R_10">Volatility 10 (1s)</option>
            <option value="R_25">Volatility 25 (1s)</option>
            <option value="R_50">Volatility 50 (1s)</option>
            <option value="R_100">Volatility 100 (1s)</option>
          </select>
        </label>
        <label>Stake: <input type="number" id="stake-ou" value="0.35" /></label>
        <label>Prediction Digit: <input type="number" id="digit-ou" min="0" max="9" /></label>
        <div class="button-group">
          <button id="overBtn">Over</button>
          <button id="underBtn">Under</button>
        </div>
        <div class="status">Trade result will appear here.</div>
      </div>
    </div>
  `;
}

// Load default tab
window.addEventListener("DOMContentLoaded", () => {
  switchTab("even-odd");
});
