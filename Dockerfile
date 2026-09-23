# Single-container deploy for Render/Railway/Docker: Next.js frontend (public port)
# proxies /api/* to a FastAPI backend running on an internal port.
# Uses one consistent Debian base throughout to avoid glibc/musl ABI mismatches.

# Stage 1: build the Next.js frontend
FROM node:22-bookworm-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .

# Baked in at build time: browser calls same-origin /api/*, proxied by next.config.mjs
ENV NEXT_PUBLIC_API_BASE=/api
RUN npm run build

# Stage 2: production runtime (Node + Python, same Debian base as builder)
FROM node:22-bookworm-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Backend: install deps into a venv using this image's own Python
COPY backend/requirements-prod.txt /app/backend/requirements-prod.txt
RUN python3 -m venv /app/backend/venv && \
    /app/backend/venv/bin/pip install --no-cache-dir -r /app/backend/requirements-prod.txt
COPY backend/ /app/backend/

# Frontend: optimized standalone server + static assets (fits easily in Render's 512MB RAM)
COPY --from=frontend-builder /app/frontend/.next/standalone /app/frontend
COPY --from=frontend-builder /app/frontend/.next/static /app/frontend/.next/static
COPY --from=frontend-builder /app/frontend/public /app/frontend/public

# Robust process supervisor
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV BACKEND_PORT=8811
EXPOSE 3000

CMD ["/bin/bash", "/app/start.sh"]
