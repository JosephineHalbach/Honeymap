const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 5,
  minZoom: 2,
}).addTo(map);

const targetCities = {
  22: [52.52, 13.405],     // Berlin
  80: [48.8566, 2.3522],   // Paris
  443: [51.5074, -0.1278], // London
  3306: [50.1109, 8.6821], // Frankfurt
  23: [55.7558, 37.6173],  // Moskau
  default: [40.7128, -74.0060] // New York
};

const attackData = [
  { ip: "45.76.12.103", lat: 37.7749, lon: -122.4194, port: 22, time: "2025-07-03T21:12:00" },
  { ip: "192.168.0.45", lat: 35.6895, lon: 139.6917, port: 443, time: "2025-07-03T21:13:22" },
  { ip: "66.249.66.1", lat: 55.7558, lon: 37.6173, port: 3306, time: "2025-07-03T21:14:11" }
];

function getTargetCoords(port) {
  return targetCities[port] || targetCities.default;
}

function logToTerminal(message) {
  const terminal = document.getElementById('terminal');
  terminal.innerText += message + "\n";
  terminal.scrollTop = terminal.scrollHeight;
}

function addAttack(entry, delay) {
  setTimeout(() => {
    const from = [entry.lat, entry.lon];
    const to = getTargetCoords(entry.port);

    L.polyline([from, to], {
      color: 'red',
      weight: 2,
      opacity: 0.6
    }).addTo(map);

    L.circleMarker(from, {
      radius: 6,
      fillColor: "#f03",
      color: "#f03",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map).bindPopup(`💥 Angriff von ${entry.ip} auf Port ${entry.port}`);

    logToTerminal(`⚠️ ${entry.time}: Angriff von ${entry.ip} auf Port ${entry.port}`);
  }, delay);
}

attackData.forEach((entry, index) => addAttack(entry, index * 1500));
