# Use Node 22 to meet Prisma requirements
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma folder BEFORE npm install so postinstall can find it
COPY prisma ./prisma

# Install dependencies
RUN npm install --production

# Copy rest of the source code
COPY . .

# Expose the port
EXPOSE 8080

# Start the server
CMD ["node", "index.js"]