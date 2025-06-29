const app_id = 82139; // Your WebSocket App ID
const linkBtn = document.getElementById('linkAccount');
const tradeBtn = document.getElementById('startTrading');
const status = document.getElementById('status');

linkBtn.onclick = () => {
  const redirect = window.location.origin + window.location.pathname;
  const oauthURL = `https://oauth.deriv.com/oauth2/authorize?app_id=${app_id}&redirect_uri=${redirect}`;
  window.location.href = oauthURL;
};

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token1');

  if (token) {
    localStorage.setItem('deriv_token', token);
    connectToDeriv(token);
    window.history.replaceState({}, document.title, window.location.pathname); // clean URL
  } else {
    const savedToken = localStorage.getItem('deriv_token');
    if (savedToken) {
      connectToDeriv(savedToken);
    }
  }
};

function connectToDeriv(token) {
  const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=' + app_id);

  ws.onopen = () => {
    ws.send(JSON.stringify({ authorize: token }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.error) {
      status.textContent = '❌ Invalid or expired token. Please link account again.';
      tradeBtn.disabled = true;
      localStorage.removeItem('deriv_token');
    } else if (data.msg_type === 'authorize') {
      status.textContent = `✅ Welcome, ${data.authorize.loginid}`;
      tradeBtn.disabled = false;
    }
  };
}
