const targetCities = {
  22: [52.52, 13.405],     // Berlin
  80: [48.8566, 2.3522],   // Paris
  443: [51.5074, -0.1278], // London
  3306: [50.1109, 8.6821], // Frankfurt
  23: [55.7558, 37.6173],  // Moskau
  default: [40.7128, -74.0060] // New York
};

function getTargetCoords(port) {
  return targetCities[port] || targetCities.default;
}
function addAttack(entry, delay) {
  setTimeout(() => {
    const from = [entry.lat, entry.lon];
    const to = getTargetCoords(entry.port);

    const line = L.polyline([from, to], {
      color: 'red',
      weight: 2,
      opacity: 0.6
    }).addTo(map);

    L.marker(from, { icon: attackIcon })
      .addTo(map)
      .bindPopup(`💥 Angriff von ${entry.ip}<br>Port: ${entry.port}<br>${entry.time}`)
      .openPopup();

    logToTerminal(`⚠️ Angriff von ${entry.ip} auf Port ${entry.port} → ${to}`);
  }, delay);
}
