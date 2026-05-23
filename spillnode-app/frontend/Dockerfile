# ===== Build stage =====
FROM node:20-alpine AS build
WORKDIR /app

# Bring in lockfile + manifest first (better Docker layer caching)
COPY package.json yarn.lock* ./

# Enable yarn via corepack, then install. Fall back to a non-frozen install
# if yarn.lock is missing or out of sync with package.json.
RUN corepack enable && \
    if [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile --network-timeout 600000 || \
      yarn install --network-timeout 600000; \
    else \
      yarn install --network-timeout 600000; \
    fi

COPY . .
RUN npx ng build --configuration=production

# ===== Runtime stage =====
FROM nginx:alpine
COPY --from=build /app/dist/spillnode-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
