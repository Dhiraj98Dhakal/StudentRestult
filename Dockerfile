# Dockerfile - For development
# =============================

FROM node:18-alpine

# Install development tools
RUN apk add --no-cache python3 make g++ curl

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Create non-root user (optional for dev)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /usr/src/app

USER nodejs

# Expose port
EXPOSE 5000

# Use nodemon for development (auto-restart on changes)
CMD ["npm", "run", "dev"]