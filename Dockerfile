# Frontend web service (Railway). Builds the site and runs server.mjs, which
# serves dist/ and proxies /api and /uploads to BACKEND_URL.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY server.mjs ./
EXPOSE 3000
CMD ["node", "server.mjs"]
