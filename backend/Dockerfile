# Backend Dockerfile

FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY backend backend

RUN npm install

RUN npm run build --workspace=backend

FROM node:20-alpine

WORKDIR /app/backend

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/package*.json ./

EXPOSE 8080

CMD ["node", "dist/server.js"]
