# Gunakan Node.js versi terbaru LTS
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json & lockfile
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy seluruh source code
COPY . .

# Build NestJS (transpile TypeScript -> JavaScript)
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

# Copy package.json dan install hanya production deps
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

# Copy hasil build dari stage sebelumnya
COPY --from=builder /app/dist ./dist

# Expose port NestJS
EXPOSE 3000

# Start app
CMD ["node", "dist/main.js"]
