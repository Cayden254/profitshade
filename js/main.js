// main.js

let socket;
const app_id = 82139; // Your Deriv App ID

document.getElementById('link-account').addEventListener('click', () => {
  const url = `https://oauth.deriv.com/oauth2/authorize?app_id=${app_id}&redirect_uri=${window.location.href}`;
  window.location.href = url;
});

window.addEventListener('load', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token1');

  if (token) {
    localStorage.setItem('deriv_token', token);
    window.history.replaceState({}, document.title, '/'); // Clean URL
    connectToDeriv(token);
  } else {
    const storedToken = localStorage.getItem('deriv_token');
    if (storedToken) connectToDeriv(storedToken);
  }
});

function connectToDeriv(token) {
  socket = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=' + app_id);

  socket.onopen = () => {
    socket.send(JSON.stringify({ authorize: token }));
  };

  socket.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.msg_type === 'authorize') {
      const { loginid, currency, balance } = data.authorize;
      document.getElementById('account-info').innerHTML = `
        <p><strong>Account:</strong> ${loginid}</p>
        <p><strong>Currency:</strong> ${currency}</p>
        <p><strong>Balance:</strong> ${balance}</p>
      `;
      document.getElementById('account-info').classList.remove('hidden');
      document.getElementById('start-trading').classList.remove('hidden');
    } else if (data.error) {
      alert('Authorization error: ' + data.error.message);
    }
  };
}

document.getElementById('start-trading').addEventListener('click', () => {
  document.getElementById('home').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
});
