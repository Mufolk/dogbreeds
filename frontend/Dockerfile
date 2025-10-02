# Stage 1: Build frontend app
FROM node:20-alpine as builder
WORKDIR /app

# Copie arquivos de dependências e instale
COPY package*.json ./
RUN npm ci

# Copie todo código fonte
COPY . .

# Receba a variável de ambiente para a API no build time
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Rode build de produção com variável embutida
RUN npm run build

# Stage 2: Serve com nginx
FROM nginx:alpine

# Copie conteúdo buildado do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie arquivo nginx customizado para configuração do proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponha a porta 80 para o Railway
EXPOSE 80

# Comando para rodar o nginx no primeiro plano
CMD ["nginx", "-g", "daemon off;"]