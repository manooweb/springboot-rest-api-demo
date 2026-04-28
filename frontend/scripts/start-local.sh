#!/usr/bin/env sh
set -eu

CERT_DIR="/home/manu/Documents/Projets-info/remise-a-niveau-java/springboot-rest-api-demo-cert"

ng serve \
  --ssl \
  --ssl-cert "$CERT_DIR/localhost+3.pem" \
  --ssl-key "$CERT_DIR/localhost+3-key.pem" \
  --host localhost \
  --port 4200 \
  --proxy-config proxy.local.conf.json
