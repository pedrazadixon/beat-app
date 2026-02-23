# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm ci

# Build-time env vars
ARG VITE_API_URL
ARG VITE_YOUTUBE_API_TOKEN

# Make them available to Vite during the build step
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_YOUTUBE_API_TOKEN=$VITE_YOUTUBE_API_TOKEN

# Build the app
COPY . .
RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:stable-alpine AS runner

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
