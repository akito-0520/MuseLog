# Stage 1: Install dependencies and build the Next.js app
# Use a Node.js LTS version for building
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and lock files to install dependencies
COPY package.json package-lock.json* ./

# Install dependencies
# Using `npm ci` for clean install based on package-lock.json
RUN npm ci

# Copy the rest of the application files
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application
RUN npm run build

# Stage 2: Run the Next.js app
# Use a lean Node.js runtime image
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV production

# Disable Next.js telemetry during runtime
ENV NEXT_TELEMETRY_DISABLED 1

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
# If you have .env.production, copy it. Example:
# COPY --from=builder /app/.env.production ./.env.production


# Expose the port Next.js runs on (default is 3000)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
