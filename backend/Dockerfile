# Backend Dockerfile (Development Mode)
FROM node:20-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install ALL dependencies
RUN npm install

# Copy Prisma schema first
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy rest of source code
COPY . .

# Expose port
EXPOSE 3001

# Enable file watching for nodemon in Docker
ENV CHOKIDAR_USEPOLLING=true
ENV CHOKIDAR_INTERVAL=1000

# Start server in development mode with nodemon (hot reload)
CMD ["npm", "run", "dev"]
