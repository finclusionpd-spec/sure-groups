#!/usr/bin/env bash
set -euo pipefail

# Usage: scripts/tunnel-watchdog.sh [target_url]
# Example: scripts/tunnel-watchdog.sh http://127.0.0.1:5174

TARGET_URL="${1:-http://127.0.0.1:5174}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLOUDFLARED_BIN="${PROJECT_ROOT}/cloudflared-linux-amd64"
LOG_FILE="${PROJECT_ROOT}/cloudflared.log"
URL_FILE="${PROJECT_ROOT}/public_url.txt"

mkdir -p "${PROJECT_ROOT}/scripts"
touch "${LOG_FILE}"

if [[ ! -x "${CLOUDFLARED_BIN}" ]]; then
  chmod +x "${CLOUDFLARED_BIN}" || true
fi

extract_url() {
  grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "${LOG_FILE}" | tail -n 1 || true
}

# Populate URL_FILE from existing log if available
existing_url="$(extract_url || true)"
if [[ -n "${existing_url}" ]]; then
  echo "${existing_url}" > "${URL_FILE}"
fi

while true; do
  if ! pgrep -f "cloudflared-linux-amd64 tunnel" >/dev/null 2>&1; then
    echo "[$(date -Is)] cloudflared not running; starting quick tunnel to ${TARGET_URL}" >> "${PROJECT_ROOT}/scripts/watchdog.log"
    "${CLOUDFLARED_BIN}" tunnel --url "${TARGET_URL}" --no-autoupdate --logfile "${LOG_FILE}" --loglevel info &
    # Wait briefly for cloudflared to announce the URL
    for i in {1..30}; do
      sleep 1
      url="$(extract_url || true)"
      if [[ -n "${url}" ]]; then
        echo "${url}" > "${URL_FILE}"
        echo "[$(date -Is)] tunnel url: ${url}" >> "${PROJECT_ROOT}/scripts/watchdog.log"
        break
      fi
    done
  fi
  sleep 10
done

