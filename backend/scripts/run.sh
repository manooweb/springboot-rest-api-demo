#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

set -a
source "$BACKEND_DIR/.env"
set +a

cd "$BACKEND_DIR"

./mvnw spring-boot:run
