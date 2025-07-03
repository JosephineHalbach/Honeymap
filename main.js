document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map", {
    worldCopyJump: true
  }).setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // Funktion zum Generieren zufälliger Koordinaten
  function randomCoord() {
    return [Math.random() * 180 - 90, Math.random() * 360 - 180];
  }

  // Animierte Fluglinie erzeugen
  function showAttack() {
    const from = randomCoord();
    const to = randomCoord();

    const line = L.polyline([from, to], {
      color: "red",
      weight: 2,
      opacity: 0.7,
      dashArray: "5,10"
    }).addTo(map);

    setTimeout(() => map.removeLayer(line), 4000);
  }

  // Alle 300 ms ein neuer Angriff
  setInterval(showAttack, 300);
});
