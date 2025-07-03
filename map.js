const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap',
}).addTo(map);

const berlin = [52.52, 13.405]; // Zielstadt für Angriffe
const attackIcon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Warning_icon.svg',
  iconSize: [24, 24]
});

function addAttack(entry, delay) {
  setTimeout(() => {
    const from = [entry.lat, entry.lon];
    const to = berlin;

    const line = L.polyline([from, to], { color: 'red', weight: 2, opacity: 0.6 }).addTo(map);
    L.marker(from, { icon: attackIcon }).addTo(map)
      .bindPopup(`💥 Angriff von ${entry.ip}<br>${entry.time}`).openPopup();

    logToTerminal(`⚠️ Angriff von ${entry.ip} → Berlin [SSH Login Attempt]`);
  }, delay);
}

function logToTerminal(text) {
  const terminal = document.getElementById('terminal-content');
  const line = document.createElement('div');
  line.textContent = text;
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;
}

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    let delay = 0;
    data.forEach((entry, i) => {
      addAttack(entry, delay);
      delay += 1500; // alle 1.5 Sekunden neuer Angriff
    });
  });
