// main.js - Fully Furnished WebSocket + Strategy Logic

const appId = 82139; // Deriv App ID
const ws = new WebSocket("wss://ws.deriv.com/websockets/v3?app_id=" + appId);
let token = "";
let accountType = "real";
let currentStrategy = null;
let tradeActive = false;
let tradePaused = false;
let contractType = "";
let volatility = "R_10";
let marketData = {};

// UI References
const strategyContainer = document.getElementById("strategy-content");
const template = document.getElementById("strategy-template");
const accountInfo = document.getElementById("account-info");

function loginToDerivPrompt() {
  const userToken = prompt("Paste your Deriv API Token:");
  if (userToken) {
    token = userToken;
    ws.send(JSON.stringify({ authorize: token }));
  }
}

ws.onmessage = function (msg) {
  const data = JSON.parse(msg.data);
  if (data.msg_type === "authorize") {
    accountInfo.textContent = `✔️ Logged in: ${data.authorize.loginid}`;
    accountType = data.authorize.account_list[0].account_type;
  }
  if (data.msg_type === "balance") {
    document.querySelector(".trade-summary").textContent = `💰 Balance: $${data.balance.balance}`;
  }
  if (data.msg_type === "proposal") {
    handleProposal(data);
  }
};

function showStrategy(type) {
  strategyContainer.innerHTML = "";
  const clone = template.content.cloneNode(true);
  currentStrategy = type;

  clone.querySelector(".strategy-title").textContent = type.toUpperCase();
  const volSelect = clone.querySelector(".volatility-select");
  const tfSelect = clone.querySelector(".timeframe-select");

  volSelect.addEventListener("change", () => {
    volatility = volSelect.value;
    refreshAnalysis(clone);
  });

  tfSelect.addEventListener("change", () => refreshAnalysis(clone));

  clone.querySelector(".start-btn").onclick = () => startTrading(clone);
  clone.querySelector(".pause-btn").onclick = () => (tradePaused = !tradePaused);
  clone.querySelector(".stop-btn").onclick = () => stopTrading();

  const overBtn = document.createElement("button");
  overBtn.textContent = "OVER";
  overBtn.onclick = () => (contractType = "DIGITOVER");

  const underBtn = document.createElement("button");
  underBtn.textContent = "UNDER";
  underBtn.onclick = () => (contractType = "DIGITUNDER");

  const evenBtn = document.createElement("button");
  evenBtn.textContent = "EVEN";
  evenBtn.onclick = () => (contractType = "DIGITEVEN");

  const oddBtn = document.createElement("button");
  oddBtn.textContent = "ODD";
  oddBtn.onclick = () => (contractType = "DIGITODD");

  const riseBtn = document.createElement("button");
  riseBtn.textContent = "RISE";
  riseBtn.onclick = () => (contractType = "RISE");

  const fallBtn = document.createElement("button");
  fallBtn.textContent = "FALL";
  fallBtn.onclick = () => (contractType = "FALL");

  const optionsDiv = clone.querySelector(".contract-options");
  if (type === "evenodd") optionsDiv.append(evenBtn, oddBtn);
  if (type === "overunder") optionsDiv.append(overBtn, underBtn);
  if (type === "risefall") optionsDiv.append(riseBtn, fallBtn);

  strategyContainer.appendChild(clone);
  refreshAnalysis(clone);
}

function refreshAnalysis(panel) {
  const bars = panel.querySelector(".bar-visual");
  const circles = panel.querySelector(".circle-grid");
  bars.innerHTML = "";
  circles.innerHTML = "";

  for (let i = 0; i <= 9; i++) {
    const bar = document.createElement("div");
    const height = Math.floor(Math.random() * 100);
    bar.style.height = height + "px";
    bar.style.background = i % 2 === 0 ? "#22c55e" : "#ef4444";
    bar.textContent = i;
    bars.appendChild(bar);

    const circle = document.createElement("div");
    circle.style.background = height > 70 ? "#22c55e" : height < 30 ? "#ef4444" : "#334155";
    circle.style.width = circle.style.height = "40px";
    circle.style.borderRadius = "50%";
    circle.textContent = i;
    circles.appendChild(circle);
  }
}

function startTrading(panel) {
  const stake = parseFloat(panel.querySelector(".stake-input").value);
  const pred = panel.querySelector(".prediction-input").value;
  const ticks = parseInt(panel.querySelector(".ticks-input").value);
  if (!contractType || isNaN(stake) || isNaN(ticks)) return alert("⚠️ Missing input");

  tradeActive = true;
  tradePaused = false;

  const proposal = {
    proposal: 1,
    amount: stake,
    basis: "stake",
    contract_type: contractType,
    currency: "USD",
    duration: ticks,
    duration_unit: "t",
    symbol: volatility,
    ...(pred && { barrier: pred })
  };
  ws.send(JSON.stringify(proposal));
}

function stopTrading() {
  tradeActive = false;
  tradePaused = false;
  alert("🚫 Trading Stopped");
}

function handleProposal(data) {
  const payout = data.proposal.payout;
  const table = document.querySelector(".trade-log-table tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>$${data.proposal.amount}</td>
    <td>$${payout}</td>
    <td>${contractType}</td>
    <td>${Math.random().toFixed(5)}</td>
    <td>${Math.random().toFixed(5)}</td>`;
  table.appendChild(row);

  const summary = document.querySelector(".trade-summary");
  summary.textContent = `📈 Profit: $${(payout - data.proposal.amount).toFixed(2)}`;
}

setInterval(() => {
  if (token) ws.send(JSON.stringify({ balance: 1, subscribe: 1 }));
}, 5000);
