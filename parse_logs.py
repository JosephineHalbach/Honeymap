import json
import geoip2.database
from datetime import datetime

# INPUT: Pfad zur Cowrie-Logdatei
log_file = "/path/to/cowrie.json"
output_file = "docs/data/attacks.json"  # Damit GitHub Pages es hosten kann

geoip_reader = geoip2.database.Reader("GeoLite2-City.mmdb")

def parse_logs():
    attacks = []
    with open(log_file, "r") as f:
        for line in f:
            try:
                log = json.loads(line)
                if log.get("eventid") == "cowrie.session.connect":
                    ip = log.get("src_ip")
                    port = log.get("dst_port", 22)
                    timestamp = log.get("timestamp")
                    geo = geoip_reader.city(ip)

                    attacks.append({
                        "ip": ip,
                        "port": port,
                        "timestamp": timestamp,
                        "country": geo.country.name,
                        "latitude": geo.location.latitude,
                        "longitude": geo.location.longitude
                    })
            except Exception:
                continue
    with open(output_file, "w") as out:
        json.dump(attacks, out, indent=2)

if __name__ == "__main__":
    parse_logs()
