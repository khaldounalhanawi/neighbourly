const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const app = document.getElementById('app');
const user = tg.initDataUnsafe?.user;

app.innerHTML = `
  <h1>Hello, ${user?.first_name || 'friend'}!</h1>
  <button id="confirmBtn">Confirm</button>
  <button id="connectWallet" style="margin-top: 12px;">🔗 Connect TON Wallet</button>
  <div id="walletAddress" style="margin-top: 12px; font-size: 14px; color: #22d3ee;"></div>
`;

tg.MainButton.text = "Confirm";
tg.MainButton.onClick(() => tg.sendData("Confirm clicked"));
tg.MainButton.show();

document.getElementById("confirmBtn").addEventListener("click", () => {
  tg.sendData("Button pressed");
});

// --- 👇 TON Connect Integration ---
const tonConnect = new TON_CONNECT.TonConnect({
  manifestUrl: 'https://YOUR_DOMAIN/tonconnect-manifest.json' // 🔹 Replace with your own domain
});

async function connectWallet() {
  try {
    const wallet = await tonConnect.connectWallet();
    if (wallet?.account) {
      const address = wallet.account.address;
      document.getElementById("walletAddress").innerText = `Wallet: ${address}`;
      tg.showAlert(`Wallet connected: ${address}`);
    }
  } catch (error) {
    console.error('Wallet connection failed', error);
    tg.showAlert('Failed to connect wallet.');
  }
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);

// Optional: auto reconnect if user already connected
if (tonConnect.connected) {
  const address = tonConnect.wallet?.account.address;
  document.getElementById("walletAddress").innerText = `Wallet: ${address}`;
}
