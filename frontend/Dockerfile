# Frontend Dockerfile - Multi-stage build for React 19 + Vite 8
FROM node:22-alpine AS builder
WORKDIR /app

ARG VITE_API_BASE_URL=/api
ARG VITE_ML_SERVICE_URL=/ml
ARG VITE_APP_TITLE=JALRAKSHAK

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_ML_SERVICE_URL=$VITE_ML_SERVICE_URL
ENV VITE_APP_TITLE=$VITE_APP_TITLE

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
