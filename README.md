# 🛍️ MoniTUR – Sistema de Monitoramento de Pesquisas Turísticas

## 📌 Descrição do Projeto
**MoniTUR** é uma plataforma desenvolvida pela **Secretaria de Turismo de Rondônia (SETUR/RO)** com o objetivo de monitorar, mensurar e avaliar dados turísticos através de pesquisas aplicadas em diferentes contextos, como **eventos fomentados** e **locais fixos de visitação**.
A aplicação permite a coleta de dados públicos e apresenta as informações em um dashboard dinâmico, estatístico e de fácil visualização, facilitando a tomada de decisões baseadas em dados e fortalecendo a política pública do turismo Rondoniense.

---

## 🛠️ Tecnologias Utilizadas
O projeto **MoniTUR** foi desenvolvido com foco em estrutura robusta, facilidade de uso e expansão futura.

| Camada              | Tecnologia                 | Descrição                             |
|---------------------|----------------------------|---------------------------------------|
| Backend             | Next.js API Routes         | Rotas RESTful integradas              |
| ORM                 | Prisma                     | Mapeamento objeto-relacional          |
| Frontend            | Next.js + React            | SPA com SSR e rotas dinâmicas         |
| Autenticação        | NextAuth.js                | Login seguro com JWT                  |
| Permissões          | Middleware custom          | Controle de acesso por papéis         |
| Banco de Dados      | Postgres                   | Relacional, compatível com Prisma     |
| Estilo              | Tailwind CSS               | Estilização moderna e responsiva      |
| Gráficos            | Chart.js / ApexCharts      | Visualização de dados                 |

---

# 🌟 Funcionalidades
- 🗓️ Cadastro e gerenciamento de pesquisas turísticas
- 📝 Criação de formulários dinâmicos com perguntas customizadas
- 👥 Coleta de dados de três públicos:
  - Participantes
  - Expositores e vendedores
  - Organizadores
- 📊 Dashboard com gráficos e métricas em tempo real
- 📄 Exportação de dados em CSV e Excel
- 👤 Controle de usuários e permissões por papel
- 🔒 Autenticação segura com NextAuth

## 📂 Estrutura do Projeto

```
monitur/
├── prisma/               # 🧬 Esquema e migrações do banco de dados (Prisma)
│   ├── schema.prisma     # 📐 Definição das tabelas e relações
│   └── migrations/       # 🗄️ Histórico de alterações no banco
├── src/                  # 🧠 Código-fonte principal da aplicação
│   ├── app/              # 🚀 Código-fonte principal da aplicação para o App Router
│   │   ├── api/          # 🔌 Rotas da API (Route Handlers)
│   │   ├── layout.tsx    # 🖼️ Layouts globais e por segmento de rota
│   │   ├── page.tsx      # 🏠 Página inicial da aplicação (root route)
│   │   ├── globals.css   # 🎨 Estilos globais (inclui Tailwind CSS imports)
│   │   └── favicon.ico   # 🌐 Favicon
│   ├── components/       # 🧩 Componentes React reutilizáveis (Client Components e Server Components)
│   │   └── ui/           # Componentes Shadcn/ui
│   ├── lib/              # 🧰 Funções auxiliares (PrismaClient, helpers de autenticação, etc.)
│   └── types/            # 📚 Tipagens TypeScript compartilhadas (interfaces, etc.)
├── public/               # 🌐 Arquivos estáticos (imagens, manifest.json para PWA, etc.)
├── middleware.ts         # 🛡️ Middlewares de autenticação e autorização (no nível da raiz do projeto)
├── .env                  # ⚙️ Variáveis de ambiente
├── package.json          # 📦 Dependências e scripts do projeto
├── tsconfig.json         # 🧠 Configuração do TypeScript
└── README.md             # 📘 Documentação do projeto
```
---

## 📅 Requisitos de Instalação
Antes de iniciar, certifique-se de ter instalado:

- **📦 Node.js**: [Download Node.js](https://nodejs.org/) – Ambiente de execução JavaScript
- **🐬 MySQL**: [Download MySQL](https://dev.mysql.com/downloads/) – Banco de dados relacional
- **🧭 Prisma CLI** (instalado via npm): `npm install prisma --save-dev` – ORM para gerenciamento do banco
- **🧰 Git**: [Download Git](https://git-scm.com/downloads) – Controle de versão

---

## 🧭 Arquitetura e Padrão de Projeto
O projeto **MoniTUR** adota uma arquitetura moderna baseada em **Next.js com API Routes**, estruturada de forma modular e orientada a domínios. A organização do código segue os princípios de **separação de responsabilidades**, **alta coesão** e **baixo acoplamento**, facilitando a escalabilidade e a manutenção do sistema.

### 🔹 Padrões e práticas adotadas:
- **Arquitetura Modular por Domínio**: cada funcionalidade (pesquisas, formulários, respostas) possui sua própria estrutura de rotas, lógica e componentes.
- **Camadas bem definidas**:
  - `pages/` e `components/` para a camada de apresentação
  - `lib/` e `middleware/` para lógica de negócio e segurança
  - `prisma/` para persistência de dados
- **Prisma ORM**: abstração de banco de dados com tipagem forte e migrações controladas
- **NextAuth.js**: autenticação segura com suporte a JWT e controle de sessão
- **Middlewares personalizados**: controle de permissões baseado em papéis (`admin`, `analista`, `avaliador`)
- **Componentização reutilizável**: UI construída com React e Tailwind CSS, promovendo reutilização e consistência visual

Essa arquitetura permite que o sistema cresça de forma organizada, com facilidade para adicionar novas funcionalidades, manter segurança e garantir performance.

---

## 🔗 Endpoints REST (exemplos)

| Método | Endpoint                              | Descrição                                          |
|--------|---------------------------------------|----------------------------------------------------|
| GET    | `/api/pesquisas`                      | Lista todas as pesquisas cadastradas               |
| POST   | `/api/pesquisas`                      | Cria uma nova pesquisa                             |
| GET    | `/api/formularios/{id}`               | Exibe um formulário específico                     |
| POST   | `/api/formularios`                    | Cria um novo formulário vinculado a uma pesquisa   |
| GET    | `/api/perguntas/{formulario_id}`      | Lista perguntas de um formulário                   |
| POST   | `/api/perguntas`                      | Cria uma nova pergunta                             |
| POST   | `/api/respostas`                      | Registra uma resposta de um usuário                |
| GET    | `/api/respostas/{pesquisa_id}`        | Lista respostas por pesquisa                       |
| GET    | `/api/dashboard/{pesquisa_id}`        | Retorna indicadores e métricas da pesquisa         |
| POST   | `/api/auth/login`                     | Realiza login do usuário                           |
| GET    | `/api/auth/session`                   | Retorna sessão autenticada                         |
| POST   | `/api/auth/logout`                    | Encerra a sessão do usuário                        |
| GET    | `/api/usuarios`                       | Lista usuários (admin)                             |
| POST   | `/api/usuarios`                       | Cria novo usuário                                  |
| PATCH  | `/api/usuarios/{id}/papel`            | Atualiza o papel de um usuário                     |

---

## 🧱 Estrutura do Banco de Dados

Tabelas baseadas no padrão **Data First**, conforme SQL fornecido:

- `usuarios`
- `pesquisas`
- `formularios`
- `perguntas`
- `respostas`
- `respostas_detalhes`

---

