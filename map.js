const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap',
}).addTo(map);

const attackIcon = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Warning_icon.svg',
  iconSize: [24, 24]
});

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    data.forEach(entry => {
      const marker = L.marker([entry.lat, entry.lon], { icon: attackIcon }).addTo(map);
      marker.bindPopup(
        `<b>🔴 Angriff</b><br>IP: ${entry.ip}<br>Zeit: ${entry.time}`
      );
    });
  })
  .catch(err => console.error('Fehler beim Laden der Daten:', err));

