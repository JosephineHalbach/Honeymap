document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map").setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Beispiel: Liste von Angriffen
  const attacks = [
    { from: [37.7749, -122.4194], to: [52.52, 13.405], ip: "45.76.12.103" },
    { from: [35.6895, 139.6917], to: [48.8566, 2.3522], ip: "192.168.0.45" },
    { from: [55.7558, 37.6173], to: [51.5074, -0.1278], ip: "66.249.66.1" },
    // weitere generieren oder dynamisch laden
  ];

  let index = 0;

  function showAttack() {
    const attack = attacks[index % attacks.length];
    const line = L.polyline([attack.from, attack.to], {
      color: "red",
      weight: 2,
      opacity: 0.7,
    }).addTo(map);

    setTimeout(() => map.removeLayer(line), 3000); // nach 3s wieder entfernen
    index++;
  }

  setInterval(showAttack, 500); // alle 0,5 Sekunden
});
