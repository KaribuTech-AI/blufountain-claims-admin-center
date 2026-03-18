# -----------------------------
# Build Stage
# -----------------------------
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Copy package.json and install deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build -- --configuration production

# -----------------------------
# Runtime Stage
# -----------------------------
FROM alpine:3.21

# Install NGINX
RUN apk update && \
    apk add --no-cache nginx nginx-mod-http-headers-more

# Create necessary dirs
RUN mkdir -p /run/nginx /etc/nginx/ssl

# Copy Nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/nginx.dev.common /etc/nginx/conf.d/nginx.common

# Copy SSL certs
COPY nginx/cert.pem /etc/nginx/ssl/cert.pem
COPY nginx/key.pem /etc/nginx/ssl/key.pem

# Copy Angular dist output
# ✅ Replace <project-name> with the name in angular.json
COPY --from=builder /app/dist/<project-name> /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
