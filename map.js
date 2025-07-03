 const map = L.map('map', { zoomControl: false }).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 4,
      minZoom: 2,
      noWrap: true,
      bounds: [[-90, -180], [90, 180]]
    }).addTo(map);

    const targetCities = {
      22: [52.52, 13.405],
      80: [48.8566, 2.3522],
      443: [51.5074, -0.1278],
      3306: [50.1109, 8.6821],
      23: [55.7558, 37.6173],
      default: [40.7128, -74.0060]
    };

    let playing = true;
    let currentFilter = "";
    const clusterGroup = L.markerClusterGroup();
    map.addLayer(clusterGroup);

    function getTargetCoords(port) {
      return targetCities[port] || targetCities.default;
    }

    function logToTerminal(message) {
      const terminal = document.getElementById('terminal');
      const line = document.createElement('span');
      line.textContent = message;
      terminal.appendChild(line);
      terminal.scrollTop = terminal.scrollHeight;
    }

    function randomOffset(max = 4) {
      return (Math.random() - 0.5) * max;
    }

    function createCurvedLine(from, to, color = 'lime') {
      const latlng1 = L.latLng(from[0] + randomOffset(), from[1] + randomOffset());
      const latlng2 = L.latLng(to[0] + randomOffset(), to[1] + randomOffset());
      const midpoint = [
        (latlng1.lat + latlng2.lat) / 2 + randomOffset(5),
        (latlng1.lng + latlng2.lng) / 2 + randomOffset(5)
      ];
      return L.curve([
        'M', latlng1,
        'Q', midpoint, latlng2
      ], {
        color: color,
        weight: 2,
        opacity: 0.5
      });
    }

    function addAttack(entry) {
      const from = [entry.lat, entry.lon];
      const to = getTargetCoords(entry.port);
      const color = getColorByPort(entry.port);

      const curve = createCurvedLine(from, to, color);
      curve.addTo(map);

      const marker = L.circleMarker(from, {
        radius: 4,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 0.9,
        fillOpacity: 0.7
      }).bindPopup(`IP: ${entry.ip}<br>Port: ${entry.port}<br>Zeit: ${entry.time}`);

      clusterGroup.addLayer(marker);

      const fakeMessages = [
        `> [login attempt] root@${entry.ip}`,
        `> [honeypot] Port ${entry.port} scan detected`,
        `> [drop] connection from ${entry.ip}`,
        `> [alarm] suspicious activity via ${entry.port}`
      ];

      logToTerminal(`⚠️ ${entry.time}: ${fakeMessages[Math.floor(Math.random() * fakeMessages.length)]}`);
    }

    function getColorByPort(port) {
      switch (+port) {
        case 22: return 'red';
        case 80: return 'blue';
        case 443: return 'cyan';
        case 3306: return 'orange';
        case 23: return 'magenta';
        default: return 'lime';
      }
    }

    function togglePlay() {
      playing = !playing;
    }

    function setPortFilter(port) {
      currentFilter = port;
    }

    async function fetchAttackData() {
      const response = await fetch('attack-data.json');
      const data = await response.json();

      const groupSize = 3;
      for (let i = 0; i < data.length; i += groupSize) {
        if (!playing) {
          await new Promise(r => setTimeout(r, 500));
          i -= groupSize;
          continue;
        }
        const group = data.slice(i, i + groupSize);
        group.forEach(entry => {
          if (!currentFilter || entry.port == currentFilter) {
            addAttack(entry);
          }
        });
        await new Promise(res => setTimeout(res, 800));
      }
    }

    fetchAttackData();
  </script>
