# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=8192"

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
# Make sure to build production for correct output path
RUN npm run build -- --configuration production

# Optional: check output
RUN ls -l /app/dist

# Runtime Stage
FROM alpine:3.21
RUN apk update && apk add --no-cache nginx nginx-mod-http-headers-more openssl

RUN mkdir -p /run/nginx /etc/nginx/ssl

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/nginx.dev.common /etc/nginx/conf.d/nginx.common

COPY nginx/cert.pem /etc/nginx/ssl/cert.pem
COPY nginx/key.pem /etc/nginx/ssl/key.pem

# ✅ FIXED: Copy the correct Angular dist folder
# Replace 'blufountain-claims-admin-angular' with your actual project name from angular.json
COPY --from=builder /app/dist/blufountain-claims-admin-angular /usr/share/nginx/html

# Set proper permissions (important for 403)
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
