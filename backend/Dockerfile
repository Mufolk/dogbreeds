FROM node:20-alpine as builder

WORKDIR /app/backend

# Copia package.json, package-lock.json e tsconfig.json para o build funcionar corretamente
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

COPY . .

RUN npx tsc -p tsconfig.json

FROM node:20-alpine

WORKDIR /app/backend

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package*.json ./

EXPOSE 8080

CMD ["node", "dist/server.js"]