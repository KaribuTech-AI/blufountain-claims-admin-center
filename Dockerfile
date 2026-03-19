# -----------------------
# Build Stage
# -----------------------
FROM node:20-alpine AS builder

WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build Angular production
COPY . .
RUN npm run build -- --configuration production

# Optional: list dist folder to confirm
RUN ls -l /app/dist

# -----------------------
# Runtime Stage (Nginx)
# -----------------------
FROM nginx:alpine

# Install openssl for HTTPS
RUN apk update && apk add --no-cache openssl

# Create directories for nginx and SSL
RUN mkdir -p /run/nginx /etc/nginx/ssl

# Copy Nginx config and SSL certificates
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/nginx.dev.common /etc/nginx/conf.d/nginx.common
COPY nginx/cert.pem /etc/nginx/ssl/cert.pem
COPY nginx/key.pem /etc/nginx/ssl/key.pem

# Copy Angular build to Nginx html folder
COPY --from=builder /app/dist/admin-center-dash /usr/share/nginx/html

# Set permissions to avoid 403
RUN chmod -R 755 /usr/share/nginx/html

# Expose HTTP/HTTPS
EXPOSE 80 443

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]