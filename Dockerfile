# ──────────────────── Dependencies ────────────────────
FROM node:20-bullseye-slim AS dependencies

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

# ──────────────────── Builder ────────────────────
FROM node:20-bullseye-slim AS builder

ARG VITE_APP_MODE

ARG VITE_BACKEND_URL

ARG VITE_CC_URL

ARG VITE_TEN_URL

ENV VITE_APP_MODE=$VITE_APP_MODE

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

ENV VITE_CC_URL=$VITE_CC_URL

ENV VITE_TEN_URL=$VITE_TEN_URL

WORKDIR /app

RUN npm install -g pnpm

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN pnpm production

# ──────────────────── Production ────────────────────
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
