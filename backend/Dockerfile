FROM node:20-alpine as builder

WORKDIR /app/backend

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app/backend

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package*.json ./

EXPOSE 8080

CMD ["node", "dist/server.js"]
