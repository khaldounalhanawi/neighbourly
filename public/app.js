const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const app = document.getElementById('app');
const user = tg.initDataUnsafe?.user;

app.innerHTML = `
  <h1>Hello, ${user?.first_name || 'friend'}!</h1>
  <button id="confirmBtn">Confirm</button>
`;

tg.MainButton.text = "Confirm";
tg.MainButton.onClick(() => tg.sendData("Confirm clicked"));
tg.MainButton.show();

document.getElementById("confirmBtn").addEventListener("click", () => {
  tg.sendData("Button pressed");
});
