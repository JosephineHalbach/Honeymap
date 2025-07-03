document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map", { worldCopyJump: true }).setView([20, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const targetCities = {
    22: [52.52, 13.405],     // Berlin (SSH)
    80: [48.8566, 2.3522],   // Paris (HTTP)
    443: [51.5074, -0.1278], // London (HTTPS)
    3306: [50.1109, 8.6821], // Frankfurt (MySQL)
    23: [55.7558, 37.6173]   // Moskau (Telnet)
  };

  const attacks = [
    { lat: 37.7749, lon: -122.4194, port: 22 },
    { lat: 35.6895, lon: 139.6917, port: 443 },
    { lat: 55.7558, lon: 37.6173, port: 80 },
    { lat: 48.8566, lon: 2.3522, port: 3306 },
    { lat: 52.52, lon: 13.405, port: 23 }
  ];

  let idx = 0;

  function getTarget(port) {
    return targetCities[port] || [40.7128, -74.0060]; // Default: NYC
  }

  function showArrow() {
    const atk = attacks[idx];
    const start = [atk.lat, atk.lon];
    const end = getTarget(atk.port);

    const line = L.polyline([start, end], {
      color: "lime",
      weight: 2,
      opacity: 0.7,
      dashArray: "4,8"
    }).addTo(map);

    const decorator = L.polylineDecorator(line, {
      patterns: [{
        offset: "0%",
        repeat: 0,
        symbol: L.Symbol.arrowHead({
          pixelSize: 8,
          pathOptions: { fillOpacity: 1, stroke: true, color: "lime" }
        })
      }]
    }).addTo(map);

    let offset = 0;
    const anim = setInterval(() => {
      offset += 5;
      decorator.setPatterns([{ offset: offset + "%", repeat: 0, symbol: decorator.getPatterns()[0].symbol }]);
    }, 40);

    setTimeout(() => {
      clearInterval(anim);
      map.removeLayer(line);
      map.removeLayer(decorator);
    }, 500);

    idx = (idx + 1) % attacks.length;
  }

  setInterval(showArrow, 300);
});
