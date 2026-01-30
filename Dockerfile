FROM node:20-slim

# Enable corepack for pnpm
RUN corepack enable

WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application (skip db migrations during build)
RUN pnpm build

# Expose port
EXPOSE 3000

# Start command - migrations will run at startup if needed
CMD ["node", "dist/index.js"]

