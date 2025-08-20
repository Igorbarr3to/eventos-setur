# --- Estágio 1: Base ---
# Define a imagem Node.js e instala o pnpm.
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# --- Estágio 2: Dependências ---
# Instala todas as dependências (dev e prod) para usar no build.
FROM base AS deps
RUN pnpm install

# --- Estágio 3: Build de Produção ---
# Cria a versão otimizada da sua aplicação.
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- Estágio 4: Produção (IMAGEM FINAL) ---
# Este é o estágio final, que resulta na imagem que irá para o servidor.
FROM base AS prod
WORKDIR /app

# Instala SOMENTE as dependências de produção, resultando em uma imagem menor.
RUN pnpm install --prod

# Copia os arquivos essenciais do estágio 'builder'.
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Expõe a porta que o servidor de produção do Next.js usa.
EXPOSE 3000

# Comando para iniciar o servidor de produção.
CMD ["pnpm", "start"]

# --- Estágio de Desenvolvimento ---
# Este estágio é usado pelo docker-compose local para hot-reloading.
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]