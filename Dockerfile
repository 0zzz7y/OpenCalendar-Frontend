# ---------- Build stage ----------
  FROM node:20 AS builder

  WORKDIR /app

  COPY . .

  RUN npm install

  RUN npm run build
  
  # ---------- Production stage ----------
  FROM nginx:stable-alpine

  WORKDIR /usr/share/nginx/html

  COPY --from=builder /app/build .

  EXPOSE 80
  
  CMD ["nginx", "-g", "daemon off;"]
  