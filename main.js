let attacks = [];
let currentIndex = 0;
let isPlaying = true;

const terminal = document.getElementById("terminal");
const portFilter = document.getElementById("portFilter");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");

function logToTerminal(text) {
  const time = new Date().toLocaleTimeString();
  terminal.innerHTML += `[${time}] ${text}<br>`;
  terminal.scrollTop = terminal.scrollHeight;
}

function loadMap() {
  const map = L.map("map").setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  const markerGroup = L.markerClusterGroup();
  map.addLayer(markerGroup);
  return { map, markerGroup };
}

const { map, markerGroup } = loadMap();

function getColor(port) {
  switch (+port) {
    case 22: return "red";
    case 80: return "orange";
    case 443: return "blue";
    case 3306: return "purple";
    case 23: return "magenta";
    default: return "lime";
  }
}

function getRandomTarget() {
  return [
    (Math.random() * 180 - 90).toFixed(4),
    (Math.random() * 360 - 180).toFixed(4)
  ];
}

function drawAttack(from, to, port) {
  const curve = L.curve([
    "M", from,
    "Q", [ (from[0]+to[0])/2 + (Math.random()*10-5), (from[1]+to[1])/2 + (Math.random()*10-5) ],
    to
  ], {
    color: getColor(port),
    weight: 2,
    opacity: 0.6
  }).addTo(map);

  const marker = L.circleMarker(to, {
    radius: 5,
    color: getColor(port),
    fillOpacity: 0.8
  }).bindPopup(`IP: ${from}<br>Port: ${port}`);

  markerGroup.addLayer(marker);

  setTimeout(() => {
    map.removeLayer(curve);
    markerGroup.removeLayer(marker);
  }, 9000);
}

function animateAttacks() {
  if (!isPlaying) return;
  const filtered = portFilter.value === "all"
    ? attacks
    : attacks.filter(a => a.port == portFilter.value);
  for (let i = 0; i < 3; i++) {
    const attack = filtered[(currentIndex + i) % filtered.length];
    if (attack) {
      const from = [attack.lat, attack.lon];
      const to = (attack.targetLat && attack.targetLon)
        ? [attack.targetLat, attack.targetLon]
        : getRandomTarget();
      drawAttack(from, to, attack.port);
      logToTerminal(`Attack from ${attack.ip} → [${to[0]}, ${to[1]}] on port ${attack.port}`);
    }
  }
  currentIndex = (currentIndex + 3) % filtered.length;
}

function loadAttacks() {
  fetch("attack-data.json")
    .then(r => r.json())
    .then(data => {
      attacks = data;
      setInterval(animateAttacks, 2000);
    })
    .catch(e => console.error("Fehler beim Laden:", e));
}

playBtn.onclick = () => isPlaying = true;
pauseBtn.onclick = () => isPlaying = false;

loadAttacks();
