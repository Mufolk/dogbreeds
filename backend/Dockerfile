# Stage 1: Build the application
FROM node:20-alpine as builder

WORKDIR /app/backend

COPY package*.json ./
RUN npm install

COPY . .

RUN npx tsc

# Stage 2: Create the final image
FROM node:20-alpine

WORKDIR /app/backend

COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 8080

CMD ["node", "dist/server.js"]
