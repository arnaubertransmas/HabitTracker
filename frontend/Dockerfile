# stage 1: compiles the react application
FROM node:18-alpine AS builder
WORKDIR /app

# copy&install dependencies
COPY package.json package-lock.json ./
RUN npm install

# copy production build folder
COPY . .
RUN npm run build


# FINAL CONTAINER

# stage 2: only contains the optimized build
FROM node:18-alpine
WORKDIR /app

# copy only what's needed to serve the built app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["npm", "start"]
