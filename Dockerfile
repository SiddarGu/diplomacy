# syntax=docker/dockerfile:1

FROM node:20.18.0-alpine3.20 AS app-builder

WORKDIR /app

COPY diplomacy/web/package.json .
COPY diplomacy/web/package-lock.json .

RUN npm install --force

COPY diplomacy/web/ /app
COPY diplomacy/maps/ /maps

# Needed to work around changes in OpenSSL 3.0
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm run build

FROM python:3.11.11-alpine3.21 AS server

RUN apk upgrade --no-cache

WORKDIR /app

RUN pip install --no-cache-dir pip==24.0 \
    && pip uninstall --yes setuptools wheel

COPY requirements-lock.txt .

RUN pip install --no-cache-dir -r requirements-lock.txt

COPY diplomacy/ diplomacy/
COPY README.md .
COPY setup.cfg .
COPY setup.py .

RUN pip install --no-cache-dir .

COPY --from=app-builder /app/build /app/diplomacy/web/build

# Web UI
EXPOSE 80
# Agent API
EXPOSE 8433
# DAIDE server
EXPOSE 8434-8600

CMD ["sh", "-c", "python -m http.server 80 --directory diplomacy/web/build/ & python -m diplomacy.server.run"]

LABEL org.opencontainers.image.source=https://github.com/ALLAN-DIP/diplomacy
