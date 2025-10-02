# Stage 1: Build the application
FROM node:20-alpine as builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the project
COPY . .
RUN npm run build

# Stage 2: Create the final image
FROM node:20-alpine

WORKDIR /app

# Copy only the built code and necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# The command to start the application using the built code
CMD [ "npm", "run", "start" ]
