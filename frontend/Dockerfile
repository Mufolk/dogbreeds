FROM node:20-alpine as builder

WORKDIR /app/frontend

COPY package*.json ./
COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm install
RUN npm run build

FROM node:20-alpine

WORKDIR /app/frontend

COPY --from=builder /app/frontend/dist ./dist

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
