document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map").setView([20, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const attacks = [
    { lat: 37.7749, lon: -122.4194 },
    { lat: 35.6895, lon: 139.6917 },
    { lat: 55.7558, lon: 37.6173 },
    { lat: 48.8566, lon: 2.3522 },
    { lat: 52.52, lon: 13.405 }
  ];

  let idx = 0;

  function showArrow() {
    const start = [attacks[idx].lat, attacks[idx].lon];
    const end = [Math.random() * 180 - 90, Math.random() * 360 - 180];

    const line = L.polyline([start, end], {
      color: "red",
      weight: 2,
      opacity: 0.6
    }).addTo(map);

    const decorator = L.polylineDecorator(line, {
      patterns: [{
        offset: "50%",
        repeat: 0,
        symbol: L.Symbol.arrowHead({
          pixelSize: 10,
          pathOptions: { fillOpacity: 1, color: "red" }
        })
      }]
    }).addTo(map);

    setTimeout(() => {
      map.removeLayer(line);
      map.removeLayer(decorator);
    }, 500);

    idx = (idx + 1) % attacks.length;
  }

  setInterval(showArrow, 300);
});
