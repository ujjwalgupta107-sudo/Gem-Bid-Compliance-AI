#!/bin/bash
set -e

echo "=========================================================="
echo " Starting GeM Bid Compliance AI Production Container      "
echo "=========================================================="

export BACKEND_PORT=${BACKEND_PORT:-8811}
export PORT=${PORT:-3000}
export HOSTNAME="0.0.0.0"

echo "[Backend] Starting FastAPI backend on 127.0.0.1:${BACKEND_PORT}..."
cd /app/backend
./venv/bin/uvicorn app.main:app --host 127.0.0.1 --port ${BACKEND_PORT} &

echo "[Frontend] Starting Next.js on 0.0.0.0:${PORT}..."
cd /app/frontend
exec npm start -- -p ${PORT}
