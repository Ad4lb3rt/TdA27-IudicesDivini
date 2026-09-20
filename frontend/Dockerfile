FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# adapter-node bundles all devDependencies into build/, so no node_modules at runtime.
# SSR and form actions call the backend on the shared localhost (see src/lib/api).
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3001 HOST=0.0.0.0
# Origin for the form-action CSRF check comes from Caddy's forwarded headers
# (adapter-node otherwise assumes https and rejects every POST).
ENV PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host
EXPOSE 3001
COPY --from=build /app/package.json ./
COPY --from=build /app/build ./build
CMD ["node", "build"]
