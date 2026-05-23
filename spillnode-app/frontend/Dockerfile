# ===== Build stage =====
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm ci || npm install; fi

COPY . .
RUN npx ng build --configuration=production

# ===== Runtime stage =====
FROM nginx:alpine
COPY --from=build /app/dist/spillnode-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
