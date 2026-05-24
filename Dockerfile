# ── Stage 1 : build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances en premier (cache Docker)
COPY package*.json ./
RUN npm install

# Copier le reste du projet et builder
COPY . .
RUN npm run build

# ── Stage 2 : serve ───────────────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Copier le build dans le dossier servi par nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Config nginx pour React Router (sinon les routes /login etc. font 404)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
