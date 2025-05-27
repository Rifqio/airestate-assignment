FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

RUN npx prisma generate 

# Copy app source
COPY . .

EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
