# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rurallite subdirectory contents
COPY rurallite ./rurallite

# Set working directory to rurallite app
WORKDIR /app/rurallite

# Install app dependencies
RUN npm install

# Build the Next.js app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
