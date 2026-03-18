# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Copy and install dependencies cleanly
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build -- --configuration production

# Runtime Stage
FROM alpine:3.21
# Install NGINX and headers-more module
RUN apk update && \
    apk add --no-cache nginx nginx-mod-http-headers-more

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/nginx.dev.common /etc/nginx/conf.d/nginx.common

# Copy https files
COPY nginx/cert.pem /etc/nginx/ssl/cert.pem
COPY nginx/key.pem /etc/nginx/ssl/key.pem

# Copy Angular dist output
COPY --from=builder /app/dist/browser /usr/share/nginx/html

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
