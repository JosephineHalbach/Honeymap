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

  function getRandomCoords() {
    const lat = Math.random() * 180 - 90;
    const lon = Math.random() * 360 - 180;
    return [lat, lon];
  }

  function getTarget(port) {
    return targetCities[port] || [Math.random() * 180 - 90, Math.random() * 360 - 180];
  }

  function getArcCoords(start, end) {
    const latlngs = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const lat = start[0] + (end[0] - start[0]) * (i / steps);
      const lon = start[1] + (end[1] - start[1]) * (i / steps) + Math.sin((Math.PI * i) / steps) * 10;
      latlngs.push([lat, lon]);
    }
    return latlngs;
  }

  function showArrow() {
    const start = getRandomCoords();
    const portOptions = Object.keys(targetCities);
    const port = portOptions[Math.floor(Math.random() * portOptions.length)];
    const end = getTarget(port);

    const arc = getArcCoords(start, end);

    const line = L.polyline(arc, {
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
    }, 800);
  }

  setInterval(() => {
    for (let i = 0; i < 3; i++) {
      showArrow();
    }
  }, 300);
});
