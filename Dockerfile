# --- 1: Base ---
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

# --- 2: Build ---
FROM base AS build 
COPY package.json pnpm-lock.yaml ./
# Instala todas as dependências 
RUN pnpm install 
COPY . . 
RUN pnpm exec prisma generate
RUN pnpm build

FROM base AS prod
WORKDIR /app

COPY --from=build /app .

EXPOSE 3000

CMD ["pnpm", "start"]


# --- Desenvolvimento ---
FROM base AS dev
WORKDIR /app
COPY . .
RUN pnpm install
EXPOSE 3000
CMD ["pnpm", "dev"]