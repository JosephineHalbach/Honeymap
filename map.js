const map = L.map('map').setView([20, 0], 2); // Weltweit

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 5,
  minZoom: 2,
}).addTo(map);
