FROM node:18-slim

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
RUN apt-get update && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy app source
COPY . .

EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
