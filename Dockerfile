# ---------- Etapa 1: build del SPA ----------
FROM node:20-alpine AS build
WORKDIR /app

# Instala dependencias con el lockfile para builds reproducibles
COPY package.json package-lock.json ./
RUN npm ci

# Copia el código y genera dist/
COPY . .
RUN npm run build

# ---------- Etapa 2: servir con nginx ----------
FROM nginx:1.27-alpine

# Config con fallback SPA y puerto 8080 (el que espera Cloud Run)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Artefactos estáticos
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
