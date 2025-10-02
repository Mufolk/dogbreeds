FROM node:20-alpine as builder

WORKDIR /app/frontend

COPY package*.json ./
COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY start-nginx.sh /start-nginx.sh
RUN chmod +x /start-nginx.sh

EXPOSE 80

CMD ["/start-nginx.sh"]
