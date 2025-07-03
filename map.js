function getTargetCoords(port) {
  return targetCities[port] || targetCities.default;
}

function addAttack(entry, delay) {
  setTimeout(() => {
    const from = [entry.lat, entry.lon];
    const to = getTargetCoords(entry.port);

    const line = L.polyline([from, to], { color: 'red', weight: 2, opacity: 0.6 }).addTo(map);
    L.marker(from, { icon: attackIcon }).addTo(map)
      .bindPopup(`💥 Angriff von ${entry.ip}<br>Port: ${entry.port}<br>${entry.time}`).openPopup();

    logToTerminal(`⚠️ Angriff von ${entry.ip} auf Port ${entry.port} → ${to}`);
  }, delay);
}
