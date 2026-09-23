#!/bin/bash
set -e

echo "=========================================================="
echo " Starting GeM Bid Compliance AI Production Container      "
echo "=========================================================="

export BACKEND_PORT=${BACKEND_PORT:-8811}
export PORT=${PORT:-3000}

echo "[Backend] Starting FastAPI backend on 127.0.0.1:${BACKEND_PORT}..."
cd /app/backend
./venv/bin/uvicorn app.main:app --host 127.0.0.1 --port ${BACKEND_PORT} &
BACKEND_PID=$!

echo "[Frontend] Starting Next.js frontend on port ${PORT}..."
cd /app/frontend

cleanup() {
    echo "Caught termination signal. Terminating child processes..."
    kill -TERM "$BACKEND_PID" 2>/dev/null || true
    kill -TERM "$FRONTEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
    wait "$FRONTEND_PID" 2>/dev/null || true
    exit 0
}

trap cleanup SIGTERM SIGINT

if [ -f "/app/frontend/server.js" ]; then
    echo "[Frontend] Running optimized standalone server..."
    PORT=${PORT} node /app/frontend/server.js &
else
    echo "[Frontend] Running standard npm start..."
    npm start -- -p ${PORT} &
fi
FRONTEND_PID=$!

echo "=========================================================="
echo " All services running. Monitoring processes...            "
echo "=========================================================="

wait -n $BACKEND_PID $FRONTEND_PID
EXIT_CODE=$?
echo "A monitored process has terminated with exit status ${EXIT_CODE}. Exiting container."
cleanup
exit $EXIT_CODE
