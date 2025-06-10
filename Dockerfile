# ──────────────────── Dependencies ────────────────────
FROM node:20-bullseye-slim AS dependencies

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./

RUN pnpm install

# ──────────────────── Builder ────────────────────
FROM node:20-bullseye-slim AS builder

ARG VITE_API_URL

ENV VITE_API_URL=$VITE_API_URL

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
