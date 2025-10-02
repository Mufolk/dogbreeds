# Stage 1: Build da aplicação frontend
FROM node:20-alpine as builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/. .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Stage 2: Serve os arquivos estáticos com Nginx
FROM nginx:alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
