# Frontend Dockerfile (Development Mode - HOT RELOAD)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Copy entrypoint script
COPY docker-entrypoint.sh ./

# Make entrypoint executable
RUN chmod +x docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Enable file watching in Docker (fixes hot reload in containers)
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

# Use entrypoint script that installs deps after volume mount
ENTRYPOINT ["./docker-entrypoint.sh"]
