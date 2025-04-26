# ──────────────────── Dependencies ────────────────────
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm install
# ──────────────────── Builder ────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN npm run build

# ──────────────────── Production ────────────────────
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 0000

CMD ["nginx", "-g", "daemon off;"]
