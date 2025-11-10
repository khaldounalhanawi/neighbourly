// Initialize Telegram WebApp
const tg = window.Telegram?.WebApp || null;
let currentUserId = null;
let currentInviteLink = '';
let connectedWallet = null;
let connector = null;

// Helper function for showing alerts that works in both Telegram and browser
function showAlert(message) {
  console.log('Alert:', message);
  if (!tg) {
    alert(message);
  }
}

// Wait for SDK to load
function waitForTonConnect() {
  return new Promise((resolve) => {
    if (window.TonConnectSDK) {
      resolve(window.TonConnectSDK);
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@tonconnect/sdk@2.1.3/dist/tonconnect-sdk.min.js';
      script.onload = () => resolve(window.TonConnectSDK);
      document.head.appendChild(script);
    }
  });
}

// Initialize TON Connect after page loads
window.addEventListener('load', async () => {
  try {
    // Wait for TON Connect SDK to load
    const TonConnectSDK = await waitForTonConnect();
    console.log('TON Connect SDK loaded');
    
    // Initialize the connector
    connector = new TonConnectSDK.TonConnect({
      manifestUrl: 'https://neighbourly-three.vercel.app/tonconnect-manifest.json'
    });
    
    // Set up wallet status listener
    connector.onStatusChange(async (wallet) => {
      if (wallet) {
        console.log('Wallet connected:', wallet);
        setWalletConnected(wallet.device.appName || 'TON Wallet', wallet.account.address);
      } else {
        console.log('Wallet disconnected');
        disconnectWallet();
      }
    }, console.error);

    // Check if wallet is already connected
    if (connector.connected) {
      const wallet = await connector.getWalletInfo();
      if (wallet?.account) {
        setWalletConnected(wallet.device.appName || 'TON Wallet', wallet.account.address);
      }
    }
  } catch (error) {
    console.error('Error initializing TON Connect:', error);
  }
});

// Function to check if connector is initialized
function checkConnector() {
  if (!connector) {
    console.error('TON Connect not initialized');
    showAlert('Please wait for wallet connection to initialize...');
    return false;
  }
  return true;
}

// Wallet connection functions
async function connectWalletWithSource(source) {
  if (!checkConnector()) return;
  
  const walletName = source === 'tonkeeper' ? 'Tonkeeper' : 
                    source === 'tonspace' ? 'TON Space' : 
                    'MyTonWallet';
  
  console.log(`Connecting to ${walletName}...`);
  try {
    // Use embeddedWallet for Telegram WebApp
    const embeddedWallet = source === 'tonspace' && tg;
    
    // Prepare connection options
    const options = {
      manifestUrl: 'https://neighbourly-three.vercel.app/tonconnect-manifest.json',
      items: [{ name: 'ton_addr' }]
    };
    
    if (embeddedWallet) {
      console.log('Using embedded wallet connection...');
      const universalLink = await connector.connect({
        universalLink: 'https://t.me/wallet?startapp=tonconnect-' + 
          encodeURIComponent(JSON.stringify(options))
      });
      tg.openLink(universalLink);
    } else {
      console.log('Using universal link connection...');
      const universalLink = await connector.connect({
        universalLink: source === 'tonkeeper' 
          ? 'https://app.tonkeeper.com/ton-connect'
          : source === 'tonspace'
          ? 'https://tonspace.co/ton-connect'
          : undefined
      });
      
      if (tg) {
        console.log('Opening in Telegram...');
        tg.openLink(universalLink);
      } else {
        console.log('Opening in browser...');
        window.open(universalLink, '_blank');
      }
    }
    
    closeWalletModal();
  } catch (err) {
    console.error(`Error connecting to ${walletName}:`, err);
    showAlert(`Failed to connect to ${walletName}. Please try again.`);
  }
}

async function disconnectWallet() {
  try {
    if (connector) {
      await connector.disconnect();
    }
    connectedWallet = null;
    
    const btn = document.getElementById('connectWalletBtn');
    btn.innerHTML = '<span>💳</span><span>Connect TON Wallet</span>';
    
    const statusDiv = document.getElementById('walletStatus');
    statusDiv.innerHTML = '';
    
    showAlert('Wallet disconnected successfully!');
  } catch (err) {
    console.error('Error disconnecting wallet:', err);
  }
}

function setWalletConnected(walletName, address) {
  connectedWallet = { name: walletName, address: address };
  
  const btn = document.getElementById('connectWalletBtn');
  btn.innerHTML = '<span>✅</span><span>Disconnect Wallet</span>';
  
  const statusDiv = document.getElementById('walletStatus');
  statusDiv.innerHTML = `
    <div class="wallet-connected">
      <div class="wallet-connected-address">${address}</div>
      <div class="wallet-connected-status">Connected via ${walletName}</div>
    </div>
  `;
}

// View switching functions
function switchView(view) {
  console.log('Switching to view:', view);
  
  // Hide all views
  ['homeView', 'walletView', 'rewardsView', 'tasks'].forEach(viewId => {
    const element = document.getElementById(viewId);
    if (element) {
      element.classList.add('hidden');
    }
  });
  
  // Remove active class from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Show selected view
  const selectedView = document.getElementById(`${view}View`) || document.getElementById(view);
  if (selectedView) {
    selectedView.classList.remove('hidden');
    console.log(`Showing ${view} view`, selectedView);
  } else {
    console.error(`${view} view not found!`);
  }
  
  // Activate nav item
  const navIndex = view === 'home' ? 0 : 
                  view === 'wallet' ? 1 : 
                  view === 'rewards' ? 2 : 
                  view === 'tasks' ? 3 : 0;
  
  document.querySelectorAll('.nav-item')[navIndex].classList.add('active');
}

// Modal functions
function showWalletModal() {
  console.log('Showing wallet modal');
  document.getElementById('walletModal').classList.add('show');
}

function closeWalletModal() {
  document.getElementById('walletModal').classList.remove('show');
}

// Button click handlers
document.addEventListener('DOMContentLoaded', () => {
  const connectBtn = document.getElementById('connectWalletBtn');
  if (connectBtn) {
    connectBtn.addEventListener('click', () => {
      console.log('Connect wallet button clicked');
      if (connectedWallet) {
        disconnectWallet();
      } else {
        showWalletModal();
      }
    });
  } else {
    console.error('Connect wallet button not found!');
  }
});