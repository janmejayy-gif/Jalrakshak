# Frontend Dockerfile - Multi-stage build for React/Vite
# NOTE: Docker is not currently available in the development environment.
# This file is provided for future containerization when Docker is available.

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]