/*
  Warnings:

  - You are about to drop the `Evento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pesquisa` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PesquisaTipo" AS ENUM ('EVENTO', 'GERAL');

-- CreateEnum
CREATE TYPE "PesquisaStatus" AS ENUM ('PLANEJADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "FormularioTipo" AS ENUM ('PARTICIPANTE', 'EXPOSITOR', 'ORGANIZADOR');

-- CreateEnum
CREATE TYPE "TipoResposta" AS ENUM ('TEXTO', 'NUMERO', 'OPCAO', 'MULTIPLA', 'ESCALA', 'DATA');

-- DropForeignKey
ALTER TABLE "Pesquisa" DROP CONSTRAINT "Pesquisa_eventoId_fkey";

-- DropTable
DROP TABLE "Evento";

-- DropTable
DROP TABLE "Pesquisa";

-- CreateTable
CREATE TABLE "pesquisas" (
    "id" SERIAL NOT NULL,
    "tipo" "PesquisaTipo" NOT NULL DEFAULT 'EVENTO',
    "titulo" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "local_aplicacao" VARCHAR(255),
    "titulo_projeto" VARCHAR(255),
    "objetivo_geral" TEXT,
    "objetivos_especificos" TEXT,
    "justificativa" TEXT,
    "publico_alvo" TEXT,
    "metodologia" TEXT,
    "produtos_esperados" TEXT,
    "proponente" VARCHAR(255),
    "cnpj_proponente" VARCHAR(20),
    "municipio" VARCHAR(100),
    "area_abrangencia" TEXT,
    "processo_sei" VARCHAR(50),
    "valor_total" DECIMAL(12,2),
    "fonte_recurso" VARCHAR(255),
    "elemento_despesa" VARCHAR(50),
    "data_inicio" DATE,
    "data_fim" DATE,
    "status" "PesquisaStatus" NOT NULL DEFAULT 'PLANEJADO',
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pesquisas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formularios" (
    "id" SERIAL NOT NULL,
    "pesquisa_id" INTEGER NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "tipo" "FormularioTipo" NOT NULL DEFAULT 'PARTICIPANTE',
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formularios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perguntas" (
    "id" SERIAL NOT NULL,
    "formulario_id" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo_resposta" "TipoResposta" NOT NULL,
    "opcoes_json" JSONB,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respostas" (
    "id" SERIAL NOT NULL,
    "formulario_id" INTEGER NOT NULL,
    "pesquisa_id" INTEGER NOT NULL,
    "data_resposta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" INET,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "respostas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respostas_detalhes" (
    "id" SERIAL NOT NULL,
    "resposta_id" INTEGER NOT NULL,
    "pergunta_id" INTEGER NOT NULL,
    "valor_texto" TEXT,
    "valor_numero" DECIMAL(10,2),
    "valor_data" DATE,
    "valor_opcao" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "respostas_detalhes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "formularios" ADD CONSTRAINT "formularios_pesquisa_id_fkey" FOREIGN KEY ("pesquisa_id") REFERENCES "pesquisas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perguntas" ADD CONSTRAINT "perguntas_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_formulario_id_fkey" FOREIGN KEY ("formulario_id") REFERENCES "formularios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_pesquisa_id_fkey" FOREIGN KEY ("pesquisa_id") REFERENCES "pesquisas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas_detalhes" ADD CONSTRAINT "respostas_detalhes_resposta_id_fkey" FOREIGN KEY ("resposta_id") REFERENCES "respostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas_detalhes" ADD CONSTRAINT "respostas_detalhes_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "perguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
