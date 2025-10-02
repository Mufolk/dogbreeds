# Stage 1: Build the application
FROM node:20-alpine as builder

WORKDIR /app

# Copia os arquivos da raiz para reconhecer workspaces
COPY package*.json ./

# Copia todo o monorepo
COPY . .

# Instala tudo pela raiz (resolve workspaces)
RUN npm install

# Executa build do backend especificamente
RUN npm run build --workspace=backend
# Ou substitua pelo comando adequado

# Stage 2: Create the final image
FROM node:20-alpine

WORKDIR /app/backend

# Copia apenas build e node_modules específicos do backend
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/package*.json ./

EXPOSE 8080

CMD ["node", "dist/server.js"]
