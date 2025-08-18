# --- Estágio 1: Base ---
# Define a imagem Node.js e instala o pnpm.
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# --- Estágio 2: Dependências ---
# Instala todas as dependências (dev e prod).
FROM base AS deps
RUN pnpm install

# --- Estágio 3: Build de Produção ---
# Cria a versão otimizada da aplicação.
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gera o Prisma Client específico para o ambiente Linux do container.
RUN pnpm exec prisma generate

# Roda o build do Next.js, que cria os arquivos otimizados na pasta .next.
RUN pnpm build

# --- Estágio 4: Produção ---
# Este é o estágio final da imagem que irá para o servidor.
FROM base AS prod
WORKDIR /app

# Instala SOMENTE as dependências de produção
RUN pnpm install --prod

# Copia os arquivos de build do estágio 'builder'.
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .

# Expõe a porta que o servidor de produção do Next.js usa.
EXPOSE 3000

# Comando para iniciar o servidor de produção.
CMD ["pnpm", "start"]

# --- Estágio de Desenvolvimento ---
# Este estágio não é usado no build de produção, apenas pelo docker-compose local.
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]